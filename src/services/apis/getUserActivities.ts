import { IDashboardFilter } from '@screens/Dashboard';
import { Api } from '@services/api';
import { handleToastify } from '@utils/toastifyResponses';

export interface UserActivity {
  usersActivitiesArray: string[];
  name: string;
  maintenanceHistoryCount: number;
  ticketCount: number;
  checklistCount: number;
  totalActivities: number;
}

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

    return response.data.usersActivitiesArray || [];
  } catch (error: any) {
    handleToastify(error.response?.data?.ServerMessage);
    return [];
  }
};
