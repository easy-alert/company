import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

export const getDashboardFilters = async () => {
  const uri = 'dashboard/filters';

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return {
      buildings: [],
      categories: [],
      responsible: [],
      periods: [],
    };
  }
};
