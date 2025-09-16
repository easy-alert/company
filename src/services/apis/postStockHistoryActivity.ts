// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';

interface IPostStockHistoryActivity {
  stockId: string;
  userId?: string;
  activityContent: string;
  activityImages: IAnnexesAndImages[];
}

export async function postStockHistoryActivity({
  stockId,
  userId,
  activityContent,
  activityImages,
}: IPostStockHistoryActivity) {
  const uri = `/stockHistoryActivities/`;

  const body = {
    stockId,
    userId,
    activityContent,
    activityImages,
  };

  try {
    const response = await Api.post(uri, body);

    return response;
  } catch (error: any) {
    handleToastify(error.response);

    return { stockActivities: [] };
  }
}
