import { toast } from 'react-toastify';

import {
  ICategories,
  IRequestAuxiliaryDataForCreateOccasionalMaintenance,
  IRequestCreateOccasionalMaintenance,
} from './types';
import { catchHandler, unMaskBRL } from '../../../../../utils/functions';
import { Api } from '../../../../../services/api';

export const requestCreateOccasionalMaintenance = async ({
  setModal,
  setOnQuery,
  origin,
  getCalendarData,
  data: { buildingId, executionDate, maintenanceData, categoryData, reportData },
}: IRequestCreateOccasionalMaintenance) => {
  setOnQuery(true);

  await Api.post('/buildings/reports/occasional/create', {
    buildingId: buildingId || null,
    origin,
    executionDate: new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0)) || null,
    categoryData: {
      id: categoryData.id || null,
      name: categoryData.name || null,
    },
    maintenanceData: {
      ...maintenanceData,
      id: maintenanceData.id || null,
      element: maintenanceData.element || null,
      activity: maintenanceData.activity || null,
      responsible: maintenanceData.responsible || null,
    },

    reportData: {
      cost: unMaskBRL(reportData.cost) || null,
      observation: reportData.observation || null,
      files: reportData.files || null,
      images: reportData.images || null,
    },
  })
    .then((res) => {
      setOnQuery(false);

      getCalendarData();
      toast.dismiss();
      toast.success(res.data.ServerMessage.message);
      setModal(false);
    })
    .catch((err) => {
      setOnQuery(false);

      catchHandler(err);
    });
};

export const requestAuxiliaryDataForCreateOccasionalMaintenance = async ({
  setAuxiliaryData,
  setOnQuery,
}: IRequestAuxiliaryDataForCreateOccasionalMaintenance) => {
  setOnQuery(true);

  await Api.get('/buildings/maintenances/occasional/auxiliarydata')

    .then((res) => {
      setAuxiliaryData(res.data);
      setOnQuery(false);
    })
    .catch((err) => {
      setOnQuery(false);

      catchHandler(err);
    });
};

export const findCategoryByid = ({
  id,
  categoriesData,
}: {
  id: string;
  categoriesData: ICategories[];
}) => {
  const categories = categoriesData.find((category) => category.id === id);

  if (!categories) return null;

  return categories;
};
