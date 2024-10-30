import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';
import { unMaskBRL } from '@utils/functions';

import type {
  IOccasionalMaintenanceData,
  IOccasionalMaintenanceType,
} from '@components/ModalCreateOccasionalMaintenance/types';
import type { IResponse } from '@customTypes/IResponse';

interface IRequestCreateOccasionalMaintenance {
  origin: string;
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  occasionalMaintenanceBody: IOccasionalMaintenanceData;
}

interface IResponseCreateOccasionalMaintenance extends IResponse {
  data: {
    maintenance: {
      id: string;
    };
    ServerMessage: {
      statusCode: number;
      message: string;
    };
  };
}

export const createOccasionalMaintenance = async ({
  origin,
  occasionalMaintenanceType,
  occasionalMaintenanceBody: {
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
      origin,
      occasionalMaintenanceType,
      buildingId: buildingId || null,
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

    handleToastify({
      statusCode: 200,
      message: 'Manutenção avulsa criada com sucesso',
    });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);
    return null;
  }
};
