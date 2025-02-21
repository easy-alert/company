import { Api } from '@services/api';

import type { IMaintenanceFilter } from '@screens/Maintenances/Kanban';
import { handleToastify } from '@utils/toastifyResponses';

interface IGetMaintenancesKanban {
  userId: string;
  filter: IMaintenanceFilter;
}

export async function getMaintenancesKanban({ userId, filter }: IGetMaintenancesKanban) {
  const params = {
    buildingId: filter?.buildings?.length === 0 ? '' : filter?.buildings?.join(','),
    status: filter?.status?.length === 0 ? '' : filter?.status?.join(','),
    category: filter?.categories?.length === 0 ? '' : filter?.categories?.join(','),
    user: filter?.users?.length === 0 ? '' : filter?.users?.join(','),
    priorityName: filter?.priorityName ?? '',
    startDate: filter?.startDate,
    endDate: filter?.endDate,
    userId,
  };

  const uri = '/buildings/maintenances';

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {};
  }
}
