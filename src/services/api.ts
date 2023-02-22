/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/company',
});

Api.interceptors.request.use(
  (config: any) => {
    config.headers.authorization! = `Bearer ${localStorage.getItem('authToken')}`;

    return config;
  },
  (error) => Promise.reject(error),
);
