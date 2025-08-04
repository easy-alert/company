import axios from 'axios';

export const NiboApi = axios.create({
  baseURL: 'https://api.nibo.com.br/empresas/v1',
  params: {
    apiToken: import.meta.env.VITE_NIBO_API_TOKEN || '45DCC06E5D8843F5A26A6C7F8492E6E9',
  },
});

NiboApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
