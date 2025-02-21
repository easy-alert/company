import { handleToastify } from '@utils/toastifyResponses';
import { Api } from '../../../services/api';

import { catchHandler } from '../../../utils/functions';

import type { IRequestSyndicKanban, IRequestMaintenanceDetails } from './types';

export const requestSyndicKanban = async ({
  setLoading,
  syndicNanoId,
  setFilterOptions,
  setKanban,
  setOnQuery,
  filter,
  setBuildingName,
}: IRequestSyndicKanban) => {
  setOnQuery(true);

  const uri = `/syndic/${syndicNanoId}`;

  const params = {
    year: filter.years,
    month: filter.months,
    status: filter.status,
    categoryId: filter.categoryId,
    priorityName: filter.priorityName,
  };

  try {
    const response = await Api.get(uri, { params });

    setKanban(response.data.kanban);
    setBuildingName(response.data.buildingName);

    setFilterOptions(response.data.Filters);
    setLoading(false);

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      window.open('https://easyalert.com.br/', '_self');
    } else {
      catchHandler(error);
      setLoading(false);
    }

    return {};
  } finally {
    setOnQuery(false);
  }
};

export const requestMaintenanceDetails = async ({
  maintenanceHistoryId,
}: IRequestMaintenanceDetails) => {
  const uri = `/maintenances/list/details/${maintenanceHistoryId}`;

  try {
    const response = await Api.get(uri);

    return response.data;
  } catch (error: any) {
    handleToastify(error.response, false);
    return {};
  }
};
