/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import axios from 'axios';

export const Api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://easyalert-sandbox.herokuapp.com/api'
      : 'http://localhost:8080/api',
});

Api.interceptors.request.use(
  (config: any) => {
    config.headers.authorization! = `Bearer ${localStorage.getItem('authToken')}`;

    return config;
  },
  (error) => Promise.reject(error),
);
