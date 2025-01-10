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
  TTranslateTicketType,
} from './types';
// #endregion

export const catchHandler = (err: any) => {
  toast.dismiss();
  if (err.response) {
    toast.error(err.response.data.ServerMessage.message);
  } else {
    toast.error('Erro de comunicação');
  }
};

// #region DATES
export const dateFormatter = (date: string | Date) => {
  if (!date) return '';

  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  return new Date(date).toLocaleDateString('pt-BR');
};

export const dateTimeFormatter = (date: string) =>
  new Date(date).toLocaleString('pt-BR').substring(0, 17);

export const convertToFormikDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

export const increaseDaysInDate = ({ date, daysToIncrease }: IIncreaseDaysInDate) =>
  convertToFormikDate(new Date(date.setDate(date.getDate() + daysToIncrease)));

export const addDays = ({ date, days }: { date: Date; days: number }) => {
  const newDate = date;
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// #endregion

// #region UPLOAD
export async function uploadFile(file: any) {
  let response = {};

  const formData = new FormData();
  formData.append('file', file);

  await Api.post('upload/file', formData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      catchHandler(err);
    });

  return response as IUploadFile;
}

export async function uploadManyFiles(files: any) {
  let response: IUploadFile[] = [];

  const formData = new FormData();

  for (let i = 0; i < files.length; i += 1) {
    formData.append('files', files[i]);
  }

  await Api.post('/upload/files', formData)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      catchHandler(err);
    });

  return response;
}
// #endregion

export const isImage = (src: string) => {
  const imagesExtensions = ['png', 'jpg', 'jpeg'];
  return imagesExtensions.includes((src.split('.').pop()?.toLowerCase() || '').toLowerCase());
};

// #region ERRORS
export const handleError = async ({ error }: { error: Error }) => {
  if (import.meta.env.PROD) {
    axios.post('https://ada-logs.herokuapp.com/api/easy-alert/errors/create', {
      projectName: 'EasyAlert',
      environment: window.location.host.includes('sandbox') ? 'Sandbox' : 'Production',
      side: 'Company',
      errorStack: error.stack,
      extraInfo: { url: window.location.href, user: localStorage.getItem('user') ?? '' },
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
  if (!value) return { value: '', length: 0 };

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

export const convertStateName = (stateName: string) => {
  let UF = '';

  switch (stateName) {
    case 'Acre':
      UF = 'AC';
      break;
    case 'Alagoas':
      UF = 'AL';
      break;
    case 'Amapá':
      UF = 'AP';
      break;
    case 'Amazonas':
      UF = 'AM';
      break;
    case 'Bahia':
      UF = 'BA';
      break;
    case 'Ceará':
      UF = 'CE';
      break;
    case 'Espírito Santo':
      UF = 'ES';
      break;
    case 'Goiás':
      UF = 'GO';
      break;
    case 'Maranhão':
      UF = 'MA';
      break;
    case 'Mato Grosso':
      UF = 'MT';
      break;
    case 'Mato Grosso do Sul':
      UF = 'MS';
      break;
    case 'Minas Gerais':
      UF = 'MG';
      break;
    case 'Pará':
      UF = 'PA';
      break;
    case 'Paraíba':
      UF = 'PB';
      break;
    case 'Paraná':
      UF = 'PR';
      break;
    case 'Pernambuco':
      UF = 'PE';
      break;
    case 'Piauí':
      UF = 'PI';
      break;
    case 'Rio de Janeiro':
      UF = 'RJ';
      break;
    case 'Rio Grande do Norte':
      UF = 'RN';
      break;
    case 'Rio Grande do Sul':
      UF = 'RS';
      break;
    case 'Rondônia':
      UF = 'RO';
      break;
    case 'Roraima':
      UF = 'RR';
      break;
    case 'Santa Catarina':
      UF = 'SC';
      break;
    case 'São Paulo':
      UF = 'SP';
      break;
    case 'Sergipe':
      UF = 'SE';
      break;
    case 'Tocantins':
      UF = 'TO';
      break;
    case 'Distrito Federal':
      UF = 'DF';
      break;

    default:
      break;
  }

  return UF;
};

export function ensureHttps(urlParam: string): string {
  let url = urlParam;
  // Remove any leading or trailing whitespace
  url = url.trim();

  // Check if the URL already starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // If it doesn't, add https:// to the beginning
    return `https://${url}`;
  }

  // If it starts with http://, replace it with https://
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }

  // If it already starts with https://, return it as is
  return url;
}

export const unMask = (value: string) => value.replace(/[^a-zA-Z0-9]/g, '');

export const unMaskBRL = (value: string) => value.replace(/[^0-9]/g, '');

export const capitalizeFirstLetter = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const detectFileExtension = (fileName: string): string | null => {
  const parts = fileName.split('.');

  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return null;
};
// #endregion

// #region REQUESTS

export const requestListIntervals = async ({ setTimeIntervals }: IRequestListIntervals) => {
  await Api.get('/timeinterval/list')
    .then((res) => {
      setTimeIntervals(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const requestBuildingTypes = async ({ setBuildingTypes }: IRequestBuildingTypes) => {
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
    .get(`https://viacep.com.br/ws/${unMask(cep)}/json`)
    .then((res) => {
      if (res?.data?.erro) {
        toast.error('Erro ao buscar dados do CEP.');
      } else {
        setFieldValue('city', res.data.localidade ?? '');
        setFieldValue('neighborhood', res.data.bairro ?? '');
        setFieldValue('streetName', res.data.logradouro ?? '');
        setFieldValue('state', res.data.uf ? convertStateAcronym(res.data.uf) : '');
      }
    })
    .catch(() => {
      toast.error('Erro ao buscar dados do CEP.');
    });
};

export const query = new URLSearchParams(window.location.search);
// #endregion

export const translateTicketType = (type: TTranslateTicketType): string => {
  const translations: { [key: string]: string } = {
    none: 'Nenhum',
    whatsapp: 'WhatsApp',
    email: 'Email',
    link: 'Link',
    platform: 'Plataforma',
  };

  return translations[type] || '-';
};
