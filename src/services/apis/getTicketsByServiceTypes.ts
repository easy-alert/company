import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IDashboardFilter } from '@screens/Dashboard';

export const getTicketsByServiceTypes = async (
  dashboardFilter: IDashboardFilter,
  resetFilters?: boolean,
) => {
  const uri = '/dashboard/tickets/service-types';

  const params = {
    startDate: resetFilters ? '' : dashboardFilter.startDate,
    endDate: resetFilters ? '' : dashboardFilter.endDate,
    buildings: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.buildings),
    categories: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.categories),
  };

  try {
    const response = await Api.get(uri, { params });

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return {
      ticketsServiceType: [],
      serviceTypes: [],
      colors: [],
    };
  }
};
