import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IDashboardFilter } from '@screens/Dashboard';

export const getMaintenancesByStatus = async (
  dashboardFilter: IDashboardFilter,
  resetFilters?: boolean,
) => {
  const uri = '/dashboard/maintenances/status';

  const params = {
    startDate: dashboardFilter.startDate ? dashboardFilter.startDate : '',
    endDate: dashboardFilter.endDate ? dashboardFilter.endDate : '',
    buildings: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.buildings),
    categories: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.categories),
    responsible: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.responsible),
  };

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return {
      data: [],
      labels: [],
      colors: [],
    };
  }
};
