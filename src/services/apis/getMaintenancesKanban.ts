import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IMaintenanceFilter } from '@screens/Maintenances/Kanban';

interface IGetMaintenancesKanban {
  userId: string;
  filter: IMaintenanceFilter;
}

export async function getMaintenancesKanban({ userId, filter }: IGetMaintenancesKanban) {
  const params = {
    userId,
    buildingId: filter?.buildings?.length === 0 ? '' : filter?.buildings?.join(','),
    status: filter?.status?.length === 0 ? '' : filter?.status?.join(','),
    category: filter?.categories?.length === 0 ? '' : filter?.categories?.join(','),
    user: filter?.users?.length === 0 ? '' : filter?.users?.join(','),
    priorityName: filter?.priorityNames?.length === 0 ? '' : filter?.priorityNames?.join(','),
    type: filter?.types?.length === 0 ? '' : filter?.types?.join(','),
    search: filter?.search ?? '',
    startDate: filter?.startDate,
    endDate: filter?.endDate,
  };

  const uri = '/maintenances/kanban';

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response);

    return {};
  }
}
