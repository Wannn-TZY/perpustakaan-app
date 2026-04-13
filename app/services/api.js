// services/api.js

import axios from 'axios';
import { BASE_URL } from '../constants/Config';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let authToken     = null;
let logoutHandler = null;
let isLoggingOut  = false; // ✅ Guard: cegah logout dipanggil berkali-kali

// ── Set / Remove Bearer Token ──────────────────────────────
export const setAuthToken = (token) => {
  authToken = token;
};

// ── Set Global Logout Handler ──────────────────────────────
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

// ── Request Interceptor ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor + Auto-Retry ─────────────────────
const MAX_RETRIES    = 3;
const RETRY_DELAY_MS = 1000; // backoff: 1s → 2s → 4s

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      const url = `${response.config.baseURL || ''}${response.config.url}`;
      console.log(`[API Success] ${response.config.method?.toUpperCase()} ${url}`);
    }
    return response;
  },

  async (error) => {
    const config = error.config;
    const status = error?.response?.status;
    const url    = `${config?.baseURL || ''}${config?.url}`;

    // ── Retry hanya untuk Network Error atau 5xx ──────────
    // ✅ TIDAK retry 4xx (400, 401, 403, 404, 422, 429, dll)
    //    Retry pada 429 justru memperburuk throttling
    const isNetworkError = !error.response && error.code !== 'ECONNABORTED';
    const isServerError  = status !== undefined && status >= 500;
    const shouldRetry    = (isNetworkError || isServerError) && !!config;

    if (shouldRetry) {
      config.__retryCount = config.__retryCount ?? 0;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        const delay = RETRY_DELAY_MS * Math.pow(2, config.__retryCount - 1);

        if (__DEV__) {
          console.warn(
            `[API Retry ${config.__retryCount}/${MAX_RETRIES}]`,
            `${config.method?.toUpperCase()} ${url}`,
            `— waiting ${delay}ms`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // ── Log error ──────────────────────────────────────────
    if (__DEV__) {
      if (status) {
        console.error(
          `[API Error] ${status}`,
          `${config?.method?.toUpperCase()} ${url}`,
          error?.response?.data
        );
      } else {
        console.error(
          '[API Error] Network',
          `${config?.method?.toUpperCase()} ${url}`
        );
      }
    }

    // ── 401 Unauthorized → logout sekali ──────────────────
    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      setAuthToken(null);
      logoutHandler?.();
      setTimeout(() => { isLoggingOut = false; }, 2000);
    }

    // ── 429 Too Many Requests → inject pesan user-friendly ─
    if (status === 429 && error.response?.data) {
      error.response.data.userMessage =
        'Terlalu banyak percobaan. Silakan tunggu beberapa saat.';
    }

    return Promise.reject(error);
  }
);

export default api;