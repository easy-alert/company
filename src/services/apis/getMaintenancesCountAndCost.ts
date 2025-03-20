import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IDashboardFilter } from '@screens/Dashboard';

export const getMaintenancesCountAndCost = async (
  dashboardFilter: IDashboardFilter,
  maintenanceType: 'common' | 'occasional' | '',
  resetFilters?: boolean,
) => {
  const uri = '/dashboard/maintenances/count-and-cost';

  const params = {
    startDate: resetFilters ? '' : dashboardFilter.startDate,
    endDate: resetFilters ? '' : dashboardFilter.endDate,
    buildings: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.buildings),
    categories: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.categories),
    maintenanceType,
  };

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return {
      maintenanceCount: 0,
      maintenanceCost: 'Valor investido R$ 0,00',
    };
  }
};
