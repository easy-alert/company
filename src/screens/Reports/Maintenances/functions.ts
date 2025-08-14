/* eslint-disable no-plusplus */
import * as yup from 'yup';

import { Api } from '@services/api';

import { catchHandler } from '@utils/functions';

import type { IRequestReportsData, IRequestReportsDataForSelect } from './types';

export const requestReportsData = async ({
  setOnQuery,
  setCounts,
  setMaintenances,
  setLoading,
  filters,
}: IRequestReportsData) => {
  setOnQuery(true);
  setMaintenances([]);

  const uri = '/buildings/reports/list';

  const params = {
    maintenanceStatusIds: filters.maintenanceStatusIds,
    buildingIds: filters.buildingIds,
    categoryNames: filters.categoryNames,
    startDate: filters.startDate,
    endDate: filters.endDate,
    buildingNames: filters.buildingNames,
    maintenanceStatusNames: filters.maintenanceStatusNames,
    filterBy: filters.filterBy,
    search: filters.search,
    type: filters.type,
  };

  await Api.get(uri, { params })
    .then(async (res) => {
      setMaintenances(res.data.maintenances);
      setCounts(res.data.counts);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setLoading(false);
      setOnQuery(false);
    });
};

export const requestReportsDataForSelect = async ({
  setFiltersOptions,
  setLoading,
}: IRequestReportsDataForSelect) => {
  await Api.get(`/buildings/reports/listforselect`)
    .then((res) => {
      setFiltersOptions(res.data.filters);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const schemaReportFilter = yup
  .object({
    maintenanceStatusId: yup.string(),
    responsibleSyndicId: yup.string(),
    filterBy: yup.string().required('Campo obrigatório.'),
    startDate: yup.date().required('A data inicial é obrigatória.'),
    endDate: yup
      .date()
      .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
      .required('A data final é obrigatória.'),
  })
  .required();
