/* eslint-disable no-param-reassign */
import axios from 'axios';

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/company',
});

Api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

Api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
