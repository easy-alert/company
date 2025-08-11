import { Api } from '@services/api';

import { handleToastify, handleToastifyMessage } from '@utils/toastifyResponses';
import { unMask } from '@utils/functions';

import type { IAccount, TTranslateTicketType } from '@utils/types';

interface IFormEditAccount {
  image: string;
  name: string;
  email: string;
  companyName: string;
  contactNumber: string;
  CPF: string;
  CNPJ: string;
  password: string;
  ticketType: TTranslateTicketType;
  ticketInfo: string | null;
  showMaintenancePriority: boolean;
}

interface IUpdateCompany {
  data: IFormEditAccount;
  company: IAccount['Company'];
}

export async function updateCompany({ data, company }: IUpdateCompany) {
  const uri = 'account/company';

  let ticketLink;

  if (data.ticketType === 'link') {
    if (
      data.ticketInfo &&
      !data.ticketInfo.startsWith('www.') &&
      !data.ticketInfo.startsWith('https://') &&
      !data.ticketInfo.startsWith('http://') &&
      !data.ticketInfo.startsWith('//')
    ) {
      handleToastifyMessage({
        type: 'error',
        message: 'Informe um link válido.',
      });

      return null;
    }

    // eslint-disable-next-line no-nested-ternary
    ticketLink = data.ticketInfo
      ? data.ticketInfo.startsWith('https://') || data.ticketInfo.startsWith('http://')
        ? data.ticketInfo
        : `https://${data.ticketInfo}`
      : '';
  }

  const body = {
    image: data.image,
    companyName: data.companyName,
    CNPJ: data.CNPJ !== '' ? unMask(data.CNPJ) : null,
    CPF: data.CPF !== '' ? unMask(data.CPF) : null,
    contactNumber: unMask(data.contactNumber),
    ticketInfo: ticketLink || data.ticketInfo,
    ticketType: data.ticketType,
    showMaintenancePriority: data.showMaintenancePriority,
  };

  try {
    const response = await Api.put(uri, body);

    const updatedCompany: IAccount['Company'] = {
      id: response.data.updatedCompany.id,
      image: response.data.updatedCompany.image,
      name: response.data.updatedCompany.name,
      contactNumber: response.data.updatedCompany.contactNumber,
      CNPJ: response.data.updatedCompany.CNPJ,
      CPF: response.data.updatedCompany.CPF,
      createdAt: response.data.updatedCompany.createdAt,
      UserCompanies: company.UserCompanies,
      ticketInfo: response.data.updatedCompany.ticketInfo,
      ticketType: response.data.updatedCompany.ticketType,
      showMaintenancePriority: response.data.updatedCompany.showMaintenancePriority,
      canAccessChecklists: response.data.updatedCompany.canAccessChecklists,
      linkedExternalForPayment: response.data.updatedCompany.linkedExternalForPayment,
      canAccessTickets: response.data.updatedCompany.canAccessTickets,
    };

    handleToastify(response);

    return updatedCompany;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
}
