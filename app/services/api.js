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

let authToken = null;
let logoutHandler = null;

// ── Set / Remove Bearer Token ──────────────────────────────
export const setAuthToken = (token) => {
  authToken = token;
};

// ── Set Global Logout Handler ──────────────────────────────
export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

// ── Request Interceptor (Auth) ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auto-Retry Logic ───────────────────────────────────────
// Retries failed requests up to 3 times with exponential backoff.
// This handles transient failures from the single-threaded PHP server.
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1s, 2s, 4s

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      const fullUrl = `${response.config.baseURL || ''}${response.config.url}`;
      console.log(`[API Success] ${response.config.method.toUpperCase()} ${fullUrl}`);
    }
    return response;
  },
  async (error) => {
    const config = error.config;

    // Only retry on Network Error or 5xx server errors (not 4xx client errors)
    const isNetworkError = !error.response && error.code !== 'ECONNABORTED';
    const isServerError = error.response && error.response.status >= 500;
    const shouldRetry = isNetworkError || isServerError;

    if (shouldRetry && config && !config.__retryCount) {
      config.__retryCount = 0;
    }

    if (shouldRetry && config && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      const delay = RETRY_DELAY_MS * Math.pow(2, config.__retryCount - 1);

      if (__DEV__) {
        const fullUrl = `${config.baseURL || ''}${config.url}`;
        console.warn(`[API Retry ${config.__retryCount}/${MAX_RETRIES}] ${config.method?.toUpperCase()} ${fullUrl} — waiting ${delay}ms`);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }

    // Final failure: log and reject
    const status = error?.response?.status;
    const fullUrl = `${error?.config?.baseURL || ''}${error?.config?.url}`;

    if (__DEV__) {
      console.error(`[API Error] ${status || 'Network'} ${error?.config?.method?.toUpperCase()} ${fullUrl}`, error?.response?.data);
    }

    if (status === 401) {
      setAuthToken(null);
      if (logoutHandler) {
        logoutHandler();
      }
    }

    return Promise.reject(error);
  }
);

export default api;