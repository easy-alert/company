import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { IRequestReportsData } from './types';

export const requestReportsData = async ({
  setOnQuery,
  setCounts,
  setFiltersOptions,
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
      setFiltersOptions(res.data.filters);
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
