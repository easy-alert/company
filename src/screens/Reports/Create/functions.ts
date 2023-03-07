import * as yup from 'yup';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { IRequestReportsData, IRequestReportsDataForSelect } from './types';

export const requestReportsData = async ({
  setOnQuery,
  setCounts,
  setMaintenances,
  setLoading,
  filters,
}: IRequestReportsData) => {
  setOnQuery(true);

  const filtersProcessed = {
    maintenanceStatusId: filters.maintenanceStatusId,
    buildingId: filters.buildingId,
    categoryId: filters.categoryId,
    responsibleSyndicId: filters.responsibleSyndicId,
    startDate: filters.startDate !== '' ? filters.startDate : ' ',
    endDate: filters.endDate !== '' ? filters.endDate : ' ',
  };

  await Api.get(
    `/buildings/reports/list?maintenanceStatusId=${filtersProcessed.maintenanceStatusId}&buildingId=${filtersProcessed.buildingId}&categoryId=${filtersProcessed.categoryId}&responsibleSyndicId=${filtersProcessed.responsibleSyndicId}&startDate=${filtersProcessed.startDate}&endDate=${filtersProcessed.endDate}`,
  )
    .then((res) => {
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
    buildingId: yup.string(),
    categoryId: yup.string(),
    responsibleSyndicId: yup.string(),
    startDate: yup.date().required('A data inicial é obrigatória.'),
    endDate: yup
      .date()
      .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
      .required('A data final é obrigatória.'),
  })
  .required();
