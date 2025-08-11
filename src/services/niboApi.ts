import axios from 'axios';

export const NiboApi = axios.create({
  baseURL: 'https://api.nibo.com.br/empresas/v1',
  params: {
    apiToken: import.meta.env.VITE_NIBO_API_TOKEN,
  },
});

NiboApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
