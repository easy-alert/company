// GLOBAL API
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type {
  IGetCalendarCalledParams,
  IResponseGetCalendarCalled,
} from '@customTypes/ICalendarCalled';

export const getCalendarCalled = async ({
  companyId,
  year,
  buildingId,
}: IGetCalendarCalledParams) => {
  const uri = `calendar-tickets/list/${year}?companyId=${companyId}&buildingId=${buildingId}`;

  try {
    const response: { data: IResponseGetCalendarCalled } = await Api.get(uri);
    return response.data;
  } catch (error: any) {
    handleToastify(error);
    return {
      Days: [],
      buildings: [],
    };
  }
};
