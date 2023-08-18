/* eslint-disable no-param-reassign */
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
