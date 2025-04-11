import { IDashboardFilter } from '@screens/Dashboard';

import { Api } from '@services/api';
import { catchHandler } from '@utils/functions';

export interface MaintenanceCategoriesResponse {
  totalMaintenances: number;
  totalCost: number;
  categoriesArray: Array<{
    category: string;
    count: number;
  }>;
}

export const getMaintenanceCategories = async (
  dashboardFilter: IDashboardFilter,
  maintenanceType: 'common' | 'occasional',
  resetFilters?: boolean,
): Promise<MaintenanceCategoriesResponse | null> => {
  const uri = '/dashboard/maintenances/categories';

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
