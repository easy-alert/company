/* eslint-disable no-plusplus */
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import {
  IRequestDeleteMaintenanceHistory,
  IRequestReportsData,
  IRequestReportsDataForSelect,
} from './types';

export const requestReportsData = async ({
  setOnQuery,
  setCounts,
  setMaintenances,
  setLoading,
  filters,
}: IRequestReportsData) => {
  setOnQuery(true);
  setMaintenances([]);
  await Api.get(
    `/buildings/reports/list?maintenanceStatusIds=${filters.maintenanceStatusIds}&buildingIds=${filters.buildingIds}&categoryNames=${filters.categoryNames}&startDate=${filters.startDate}&endDate=${filters.endDate}&buildingNames=${filters.buildingNames}&maintenanceStatusNames=${filters.maintenanceStatusNames}&filterBy=${filters.filterBy}`,
  )
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
    buildingId: yup.string().required('Campo obrigatório.'),
    startDate: yup.date().required('A data inicial é obrigatória.'),
    endDate: yup
      .date()
      .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
      .required('A data final é obrigatória.'),
  })
  .required();

export const requestDeleteMaintenanceHistory = async ({
  maintenanceHistoryId,
  onThenRequest,
  setModal,
  setOnModalQuery,
}: IRequestDeleteMaintenanceHistory) => {
  setOnModalQuery(true);
  await Api.delete(`/maintenances/occasional/delete/${maintenanceHistoryId}`)
    .then((res) => {
      onThenRequest();
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setModal(false);
      setOnModalQuery(false);
    });
};
