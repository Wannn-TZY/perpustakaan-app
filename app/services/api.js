// services/api.js

import axios from 'axios';
import { BASE_URL } from '../constants/Config';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let authToken = null;

// ── Set / Remove Bearer Token ──────────────────────────────
export const setAuthToken = (token) => {
  authToken = token;
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

// ── Response Interceptor (Error Handling & Logging) ────────
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Success] ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;

    if (__DEV__) {
      console.error(`[API Error] ${status || 'Network'} ${error?.config?.method.toUpperCase()} ${url}`, error?.response?.data);
    }

    if (status === 401) {
      setAuthToken(null);
      // Optional: Trigger global logout via a custom event or callback if needed
    }
    return Promise.reject(error);
  }
);

export default api;