import { Api } from '@services/api';
import { catchHandler } from '@utils/functions';
import { IDashboardFilter } from '@screens/Dashboard';
import { handleToastify } from '@utils/toastifyResponses';
import { MaintenanceCategoriesResponse, MaintenanceStatus, UserActivity } from './types';

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

export const getUserActivities = async (
  dashboardFilter: IDashboardFilter,
  resetFilters?: boolean,
): Promise<UserActivity[]> => {
  const uri = 'dashboard/users/activities';

  const params = {
    startDate: resetFilters ? '' : dashboardFilter.startDate,
    endDate: resetFilters ? '' : dashboardFilter.endDate,
    buildings: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.buildings),
    categories: resetFilters ? JSON.stringify([]) : JSON.stringify(dashboardFilter.categories),
  };

  try {
    const response = await Api.get(uri, { params });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response.data?.usersActivitiesArray)) {
      return response.data.usersActivitiesArray;
    }

    return [];
  } catch (error: any) {
    handleToastify(error.response?.data?.ServerMessage);
    return [];
  }
};
