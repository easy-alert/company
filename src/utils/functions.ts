// #region IMPORTS
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { toast } from 'react-toastify';
import { Api } from '../services/api';
import {
  IMask,
  IUploadFile,
  IRequestListIntervals,
  IRequestAddressData,
  IRequestBuildingTypes,
  IIncreaseDaysInDate,
} from './types';
// #endregion

// #region DATES
export const dateFormatter = (date: string) =>
  new Date(date).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });

export const increaseDaysInDate = ({ date, daysToIncrease }: IIncreaseDaysInDate) =>
  new Date(date.setDate(date.getDate() + daysToIncrease)).toISOString().split('T')[0];

export const convertToFormikDate = (date: string) => new Date(date).toISOString().split('T')[0];
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
      side: 'Company',
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
  mask: 'CPF' | 'CNPJ' | 'TEL' | 'CEP' | 'BRL' | 'NUM' | 'DEC';
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
    case 'DEC':
      Mask = {
        value: (Number(value.replace(/[^0-9]*/g, '')) / 100).toLocaleString('pt-br', {
          minimumFractionDigits: 2,
        }),
        length: 0,
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

export const convertStateAcronym = (UF: string) => {
  let stateName = '';

  switch (UF) {
    case 'AC':
      stateName = 'Acre';
      break;
    case 'AL':
      stateName = 'Alagoas';
      break;
    case 'AP':
      stateName = 'Amapá';
      break;
    case 'AM':
      stateName = 'Amazonas';
      break;
    case 'BA':
      stateName = 'Bahia';
      break;
    case 'CE':
      stateName = 'Ceará';
      break;
    case 'ES':
      stateName = 'Espírito Santo';
      break;
    case 'GO':
      stateName = 'Goiás';
      break;
    case 'MA':
      stateName = 'Maranhão';
      break;
    case 'MT':
      stateName = 'Mato Grosso';
      break;
    case 'MS':
      stateName = 'Mato Grosso do Sul';
      break;
    case 'MG':
      stateName = 'Minas Gerais';
      break;
    case 'PA':
      stateName = 'Pará';
      break;
    case 'PB':
      stateName = 'Paraíba';
      break;
    case 'PR':
      stateName = 'Paraná';
      break;
    case 'PE':
      stateName = 'Pernambuco';
      break;
    case 'PI':
      stateName = 'Piauí';
      break;
    case 'RJ':
      stateName = 'Rio de Janeiro';
      break;
    case 'RN':
      stateName = 'Rio Grande do Norte';
      break;
    case 'RS':
      stateName = 'Rio Grande do Sul';
      break;
    case 'RO':
      stateName = 'Rondônia';
      break;
    case 'RR':
      stateName = 'Roraima';
      break;
    case 'SC':
      stateName = 'Santa Catarina';
      break;
    case 'SP':
      stateName = 'São Paulo';
      break;
    case 'SE':
      stateName = 'Sergipe';
      break;
    case 'TO':
      stateName = 'Tocantins';
      break;
    case 'DF':
      stateName = 'Distrito Federal';
      break;

    default:
      break;
  }

  return stateName;
};

export const unMask = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

export const unMaskBRL = (value: string) => value.replace(/[^0-9]/g, '');

export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const convertToUrlString = (value: string) =>
  value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(' ', '-')
    .replaceAll(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .replaceAll('--', '-')
    .replaceAll('---', '-');
// #endregion

// #region REQUESTS
export const catchHandler = (err: any) => {
  toast.dismiss();
  if (err.response) {
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

export const requestBuldingTypes = async ({ setBuildingTypes }: IRequestBuildingTypes) => {
  await Api.get('/buildings/types/list')
    .then((res) => {
      setBuildingTypes(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const requestAddressData = async ({ cep, setFieldValue }: IRequestAddressData) => {
  toast.dismiss();
  await axios
    .get(`https://brasilapi.com.br/api/cep/v1/${unMask(cep)}`)
    .then((res) => {
      setFieldValue('city', res.data.city ?? '');
      setFieldValue('neighborhood', res.data.neighborhood ?? '');
      setFieldValue('streetName', res.data.street ?? '');
      setFieldValue('state', res.data.state ? convertStateAcronym(res.data.state) : '');
    })
    .catch(() => {
      toast.error('CEP não encontrado. Verifique o número ou digite o endereço.');
    });
};

export const query = new URLSearchParams(window.location.search);
// #endregion
