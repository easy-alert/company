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
    `/buildings/reports/list?maintenanceStatusIds=${filters.maintenanceStatusIds}&buildingIds=${filters.buildingIds}&categoryNames=${filters.categoryNames}&startDate=${filters.startDate}&endDate=${filters.endDate}`,
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
    responsibleSyndicId: yup.string(),
    startDate: yup.date().required('A data inicial é obrigatória.'),
    endDate: yup
      .date()
      .min(yup.ref('startDate'), 'A data final deve ser maior que a inicial.')
      .required('A data final é obrigatória.'),
  })
  .required();

export const requestDeleteMaintenanceHistory = async ({
  maintenanceHistoryId,
  requestReports,
  setModal,
  setModalLoading,
}: IRequestDeleteMaintenanceHistory) => {
  setModalLoading(true);

  await Api.delete(`/maintenances/occasional/delete/${maintenanceHistoryId}`)
    .then((res) => {
      requestReports();

      setModalLoading(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setModal(false);
      setModalLoading(false);
    });
};
