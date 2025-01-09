import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IDashboardFilter } from '@screens/Dashboard';

export const getMaintenancesTimeline = async (
  periodFilter: string,
  dashboardFilter: IDashboardFilter,
  resetFilters?: boolean,
) => {
  const uri = '/dashboard/maintenances/timeline';

  const params = {
    period: periodFilter,
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
      categories: [],
      series: [],
    };
  }
};
