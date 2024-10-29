// LIBS
import { toast } from 'react-toastify';

// SERVICES
import { Api } from '@services/api';

// GLOBAL UTILS
import { catchHandler, unMaskBRL } from '@utils/functions';

// TYPES
import type {
  ICategories,
  IRequestAuxiliaryDataForCreateOccasionalMaintenance,
  IRequestCreateOccasionalMaintenance,
} from './types';

export const requestCreateOccasionalMaintenance = async ({
  setModal,
  setOnQuery,
  origin,
  getCalendarData,
  data: { buildingId, executionDate, maintenanceData, categoryData, reportData, inProgress },
}: IRequestCreateOccasionalMaintenance) => {
  if (!buildingId) return toast.error('Edificação não informada.');
  if (!categoryData) return toast.error('Categoria não informada.');
  if (!categoryData.name) return toast.error('Nome da categoria não informado.');
  if (!maintenanceData.element) return toast.error('Nome da manutenção não informado.');
  if (!maintenanceData.activity) return toast.error('Atividade não informada.');
  if (!maintenanceData.responsible) return toast.error('Nome do reponsável não informado.');
  if (!executionDate) return toast.error('Data de execução não informada.');

  setOnQuery(true);

  await Api.post('/buildings/reports/occasional/create', {
    buildingId: buildingId || null,
    origin,
    executionDate: new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0)) || null,
    categoryData: {
      name: categoryData.name || null,
    },
    maintenanceData: {
      ...maintenanceData,
      element: maintenanceData.element || null,
      activity: maintenanceData.activity || null,
      responsible: maintenanceData.responsible || null,
    },
    inProgress,
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

  return null;
};

export const requestAuxiliaryDataForCreateOccasionalMaintenance = async ({
  setAuxiliaryData,
  setLoading,
}: IRequestAuxiliaryDataForCreateOccasionalMaintenance) => {
  await Api.get('/buildings/maintenances/occasional/auxiliarydata')

    .then((res) => {
      setAuxiliaryData(res.data);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);

      catchHandler(err);
    });
};

export const findCategoryById = ({
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
