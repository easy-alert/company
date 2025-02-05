import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IDashboardFilter } from '@screens/Dashboard';
import type { ITicketStatusNames } from '@customTypes/ITicket';

export const getTicketsCountAndCost = async (
  dashboardFilter: IDashboardFilter,
  ticketStatus: ITicketStatusNames | '',
  resetFilters?: boolean,
) => {
  const uri = '/dashboard/tickets/count-and-cost';

  const params = {
    startDate: resetFilters ? '' : dashboardFilter.startDate,
    endDate: resetFilters ? '' : dashboardFilter.endDate,
    buildings: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.buildings),
    categories: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.categories),
    responsible: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.responsible),
    ticketStatus,
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
