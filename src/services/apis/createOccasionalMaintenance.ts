import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';
import { unMaskBRL } from '@utils/functions';

import type { IOccasionalMaintenanceData } from '@components/ModalCreateOccasionalMaintenance/types';
import type { IResponse } from '@customTypes/IResponse';

interface IRequestCreateOccasionalMaintenance {
  origin: string;
  occasionalMaintenanceData: IOccasionalMaintenanceData;
}

interface IResponseCreateOccasionalMaintenance extends IResponse {
  data: {
    ServerMessage: {
      statusCode: number;
      message: string;
    };
  };
}

export const createOccasionalMaintenance = async ({
  origin,
  occasionalMaintenanceData: {
    buildingId,
    executionDate,
    categoryData,
    reportData,
    inProgress,
    element,
    activity,
    responsible,
  },
}: IRequestCreateOccasionalMaintenance) => {
  const uri = '/buildings/reports/occasional/create';

  try {
    const response: IResponseCreateOccasionalMaintenance = await Api.post(uri, {
      buildingId: buildingId || null,
      origin,
      executionDate: new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0)) || null,
      categoryData: {
        id: categoryData.id || null,
        name: categoryData.name || null,
      },
      maintenanceData: {
        element: element || null,
        activity: activity || null,
        responsible: responsible || null,
      },
      inProgress,
      reportData: {
        cost: unMaskBRL(reportData.cost) || null,
        observation: reportData.observation || null,
        files: reportData.files || null,
        images: reportData.images || null,
      },
    });

    handleToastify(response.data.ServerMessage);
    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);
    return null;
  }
};
