import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IAnnexesAndImages } from '@customTypes/IAnnexesAndImages';

interface ICreateMaintenanceHistoryActivity {
  maintenanceHistoryId: string;
  userId: string | null;
  comment: string | null;
  imagesToUpload: IAnnexesAndImages[];
}

export const createMaintenanceHistoryActivity = async ({
  maintenanceHistoryId,
  userId,
  comment,
  imagesToUpload,
}: ICreateMaintenanceHistoryActivity) => {
  const uri = '/maintenance-history-activities';

  const body = {
    maintenanceHistoryId,
    userId,
    content: comment || null,
    images: imagesToUpload,
  };

  try {
    const response = await Api.post(uri, body);

    handleToastify(response);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return null;
  }
};
