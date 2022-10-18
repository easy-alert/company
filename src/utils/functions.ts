// #region IMPORTS
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toast } from 'react-toastify';
import { Api } from '../services/api';
import { IMask, IUploadFile, IRequestListIntervals } from './types';
// #endregion

// #region DATES
export const dateFormatter = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });
// #endregion

// #region UPLOAD
export async function uploadFile(file: any) {
  let response = {};

  const formData = new FormData();
  formData.append('file', file);

  await Api.post('upload/file', formData).then((res) => {
    response = res.data;
  });

  return response as IUploadFile;
}
// #endregion

// #region ERRORS
export const handleError = async ({ error }: { error: Error }) => {
  if (process.env.NODE_ENV !== 'development') {
    axios.post('https://ada-logs.herokuapp.com/api/logs/create', {
      projectName: 'EasyAlert',
      environment: window.location.host.includes('sandbox') ? 'Sandbox' : 'Production',
      side: 'Backoffice',
      errorStack: error.stack,
    });
  }
};
// #endregion

// #region MASKS
export const applyMask = ({
  mask,
  value,
}: {
  mask: 'CPF' | 'CNPJ' | 'TEL' | 'CEP' | 'BRL' | 'NUM';
  value: string;
}) => {
  let Mask: IMask = { value: '', length: 0 };

  switch (mask) {
    case 'CPF':
      Mask = {
        value: value
          .replace(/\D/g, '')
          .replace(/^(\d{9})(\d)/g, '$1-$2')
          .replace(/^(\d{6})(\d)/g, '$1.$2')
          .replace(/^(\d{3})(\d)/g, '$1.$2'),
        length: 14,
      };
      break;
    case 'CNPJ':
      Mask = {
        value: value
          .replace(/\D/g, '')
          .replace(/^(\d{12})(\d)/g, '$1-$2')
          .replace(/^(\d{8})(\d)/g, '$1/$2')
          .replace(/^(\d{5})(\d)/g, '$1.$2')
          .replace(/^(\d{2})(\d)/g, '$1.$2'),
        length: 18,
      };
      break;
    case 'CEP':
      Mask = {
        value: value.replace(/\D/g, '').replace(/^(\d{5})(\d)/g, '$1-$2'),
        length: 9,
      };
      break;
    case 'TEL':
      Mask = {
        value: value
          .replace(/\D/g, '')
          .replace(/^(\d{2})(\d)/g, '($1) $2')
          .replace(/(\d)(\d{4})$/, '$1-$2'),
        length: 15,
      };
      break;
    case 'BRL':
      Mask = {
        value: (Number(value.replace(/[^0-9]*/g, '')) / 100).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
        length: 17,
      };
      break;

    case 'NUM':
      Mask = {
        value: value.replace(/[^0-9]*/g, ''),
        length: 0,
      };
      break;

    default:
      break;
  }
  return Mask;
};

export const unMask = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const convertToUrlString = (value: string) => {
  let removeLastChar;

  if (value.endsWith('-')) {
    removeLastChar = false;
  }

  let formattedValue = value
    .toLowerCase()
    .replaceAll(' ', '-')
    .split('')
    .filter((c) => (c >= 'a' && c <= 'z') || c === '-')
    .join('');

  if (removeLastChar) {
    formattedValue = formattedValue.substring(0, formattedValue.length - 1);
  }

  return formattedValue;
};
// #endregion

// #region REQUESTS
export const catchHandler = (err: any) => {
  toast.dismiss();
  if (err.response.data) {
    toast.error(err.response.data.ServerMessage.message);
  } else {
    toast.error('Erro de comunicação');
  }
};

export const requestListIntervals = async ({ setTimeIntervals }: IRequestListIntervals) => {
  await Api.get('/timeinterval/list')
    .then((res) => {
      setTimeIntervals(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
// #endregion
