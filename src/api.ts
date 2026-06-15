/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "axios";

// Centralized Axios client pointing to our local full-stack server endpoints
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT tokens into all outgoing request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("eduplan_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Graceful global error response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear compromised token or session on unauthorized responses
      const currentToken = localStorage.getItem("eduplan_token");
      if (currentToken) {
        localStorage.removeItem("eduplan_token");
        localStorage.removeItem("eduplan_user");
        window.location.href = "/login?session_expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
