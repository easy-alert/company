import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';
import type { ITicket } from '@customTypes/ITicket';

export async function putTicketById(updatedTicket: Partial<ITicket>) {
  const uri = `/tickets/${updatedTicket.id}`;

  const {
    id,
    residentName,
    residentPhone,
    residentApartment,
    residentEmail,
    residentCPF,
    description,
    userId,
    statusName,
    placeId,
    types,
  } = updatedTicket;

  const body = {
    updatedTicket: {
      id,
      residentName,
      residentPhone,
      residentApartment,
      residentEmail,
      residentCPF,
      description,
      userId,
      statusName,
      placeId,
      types,
    },
  };

  try {
    const response = await Api.put(uri, body);

    if ('seen' in updatedTicket) return updatedTicket;

    handleToastify(response);
    return response.data.ticket as ITicket;
  } catch (error: any) {
    handleToastify(error.response);

    return updatedTicket as ITicket;
  }
}
