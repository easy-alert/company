import { IDashboardFilter } from '@screens/Dashboard';
import { Api } from '@services/api';
import { catchHandler } from '@utils/functions';

export interface MaintenanceStatus {
  data: number[];
  labels: string[];
  colors: string[];
}

export const getMaintenanceStatus = async (
  dashboardFilter: IDashboardFilter,
  maintenanceType: 'common' | 'occasional',
  resetFilters?: boolean,
): Promise<MaintenanceStatus | null> => {
  const uri = 'dashboard/maintenances/status';

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
  } catch (error) {
    catchHandler(error);
    return null;
  }
};
