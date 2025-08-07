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
  const query = new URLSearchParams({
    companyId,
    year: year.toString(),
    month: month.toString(),
    ...(buildingIds &&
      buildingIds.length > 0 && {
        buildingIds: buildingIds.join(','),
      }),
  }).toString();

  const uri = `calendarTickets/list?${query}`;

  try {
    const response: { data: IResponseGetCalendarTicket } = await Api.get(uri);
    return response.data;
  } catch (error: any) {
    handleToastify(error);
    return {
      Days: [],
      buildings: [],
    };
  }
};
