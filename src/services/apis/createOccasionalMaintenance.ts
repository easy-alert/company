import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import { unMaskBRL } from '@utils/functions';

import type { IResponse } from '@customTypes/IResponse';
import type {
  IOccasionalMaintenanceData,
  IOccasionalMaintenanceType,
} from '@components/MaintenanceModals/ModalCreateOccasionalMaintenance/types';

interface IRequestCreateOccasionalMaintenance {
  origin: string;
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  occasionalMaintenanceBody: IOccasionalMaintenanceData;

  ticketsIds?: string[];
}

interface IResponseCreateOccasionalMaintenance extends IResponse {
  data: {
    maintenance: {
      id: string;
    };
    ServerMessage: {
      message: string;
    };
  };
}

export const createOccasionalMaintenance = async ({
  origin,
  ticketsIds = [],
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
    usersId,
    priorityName,
  },
}: IRequestCreateOccasionalMaintenance) => {
  const uri = '/buildings/reports/occasional/create';

  const body = {
    origin,
    occasionalMaintenanceType,
    buildingId: buildingId || null,
    executionDate: new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0)) || null,
    usersId,
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
    priorityName: priorityName || 'low',
    reportData: {
      cost: unMaskBRL(reportData.cost) || null,
      observation: reportData.observation || null,
      files: reportData.files || null,
      images: reportData.images || null,
    },
    ticketsIds,
  };

  try {
    const response: IResponseCreateOccasionalMaintenance = await Api.post(uri, body);

    handleToastify({
      status: 200,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);
    return null;
  }
};
