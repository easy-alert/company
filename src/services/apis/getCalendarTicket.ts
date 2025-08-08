import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';
import type {
  IGetCalendarTicketParams,
  IResponseGetCalendarTicket,
} from '@customTypes/ICalendarTicket';

export const getCalendarTicket = async ({
  companyId,
  year,
  month,
  buildingIds,
}: IGetCalendarTicketParams) => {
  const params = {
    companyId,
    year,
    month,
    ...(buildingIds &&
      buildingIds.length > 0 && {
        buildingIds: buildingIds.join(','),
      }),
  };

  const uri = `calendarTickets/list`;

  try {
    const response: { data: IResponseGetCalendarTicket } = await Api.get(uri, { params });
    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {
      Days: [],
    };
  }
};
