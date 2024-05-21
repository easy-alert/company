/* eslint-disable no-plusplus */
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import {
  IMaintenanceForPDF,
  IRequestDeleteMaintenanceHistory,
  IRequestReportsData,
  IRequestReportsDataForSelect,
} from './types';

async function getImageBase64(link: string): Promise<string | null> {
  const response = await fetch(link);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const requestReportsData = async ({
  setOnQuery,
  setCounts,
  setMaintenances,
  setLoading,
  filters,
  setMaintenancesForPDF,
}: IRequestReportsData) => {
  setOnQuery(true);
  setMaintenances([]);
  await Api.get(
    `/buildings/reports/list?maintenanceStatusIds=${filters.maintenanceStatusIds}&buildingIds=${filters.buildingIds}&categoryNames=${filters.categoryNames}&startDate=${filters.startDate}&endDate=${filters.endDate}`,
  )
    .then(async (res) => {
      setMaintenances(res.data.maintenances);
      setCounts(res.data.counts);

      const { maintenancesForPDF }: { maintenancesForPDF: IMaintenanceForPDF[] } = res.data;

      for (let i = 0; i < maintenancesForPDF.length; i++) {
        const { data } = maintenancesForPDF[i];

        for (let j = 0; j < data.length; j++) {
          const { images } = data[j];

          for (let k = 0; k < images.length; k++) {
            const { url } = images[k];
            // eslint-disable-next-line no-await-in-loop
            const base64Url = await getImageBase64(url);
            images[k].url = base64Url || '';
          }
        }
      }

      setMaintenancesForPDF([...maintenancesForPDF]);
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
