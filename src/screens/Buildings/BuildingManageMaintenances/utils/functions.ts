/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { toast } from 'react-toastify';

import { Api } from '@services/api';

import { catchHandler } from '@utils/functions';

import type {
  IRequestManageBuildingMaintenances,
  IRequestListCategoriesToManage,
  IRequestBuildingListForSelect,
  IRequestCategoriesForSelect,
  ICategories,
} from './types';

export const requestListCategoriesToManage = async ({
  setCategories,
  buildingId,
  setBuildingName,
  currentBuildingId,
  setTableLoading,
  setLoading,
}: IRequestListCategoriesToManage): Promise<ICategories[]> => {
  if (setTableLoading) setTableLoading(true);
  if (setLoading) setLoading(true);

  try {
    const res = await Api.post(`/buildings/maintenances/list`, {
      buildingId,
      currentBuildingId,
    });

    setBuildingName(res.data.buildingName);

    if (setCategories) setCategories(res.data.CategoriesData);
    if (setLoading) setLoading(false);
    if (setTableLoading) setTableLoading(false);

    return res.data.CategoriesData;
  } catch (err) {
    if (setLoading) setLoading(false);
    if (setTableLoading) setTableLoading(false);
    catchHandler(err);
    return [];
  }
};

export const requestManageBuildingMaintenances = async ({
  categories,
  buildingId,
  navigate,
  setOnQuery,
  origin,
}: IRequestManageBuildingMaintenances) => {
  const { search } = window.location;

  setOnQuery(true);
  toast.loading('Atualizando...');

  const buildingMaintenances: any = [];

  categories.forEach((category) => {
    buildingMaintenances.push({ categoryId: category.id, Maintenances: category.Maintenances });
  });

  const filteredBuildingMaintenances = buildingMaintenances.filter(
    (e: any) => e.Maintenances.length > 0,
  );

  await Api.put('/buildings/maintenances/edit', {
    buildingId,
    origin,
    data: filteredBuildingMaintenances,
  })
    .then((res) => {
      toast.dismiss();
      navigate(`/buildings/details/${buildingId}${search}`);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

export const requestBuildingListForSelect = async ({
  setBuildingListForSelect,
  buildingId,
}: IRequestBuildingListForSelect) => {
  await Api.get(`/buildings/listforselectwithtemplates/${buildingId}`)
    .then((res) => {
      setBuildingListForSelect(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const requestCategoriesForSelect = async ({
  setCategoriesOptions,
}: IRequestCategoriesForSelect) => {
  await Api.get('/categories/listforselect')
    .then((res) => {
      setCategoriesOptions(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
