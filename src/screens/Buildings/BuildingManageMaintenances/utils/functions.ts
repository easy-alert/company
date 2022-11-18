/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestManageBuildingMaintenances, IRequestListCategoriesToManage } from './types';

export const requestListCategoriesToManage = async ({
  setLoading,
  setCategories,
  buildingId,
}: IRequestListCategoriesToManage) => {
  await Api.post(`/buildings/maintenances/list`, {
    buildingId,
  })
    .then((res) => {
      setCategories(res.data.CategoriesData);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      catchHandler(err);
    });
};

export const requestManageBuildingMaintenances = async ({
  categories,
  buildingId,
  navigate,
  setOnQuery,
}: IRequestManageBuildingMaintenances) => {
  setOnQuery(true);
  toast.loading('Atualizando...');

  const buildingMaintenances: any = [];

  categories.forEach((category, i: number) => {
    buildingMaintenances.push({ categoryId: category.id, Maintenances: [] });
    const selectedMaintenances = category.Maintenances.filter((e) => e.isSelected === true);
    buildingMaintenances[i].Maintenances = selectedMaintenances;
  });

  const filteredBuildingMaintenances = buildingMaintenances.filter(
    (e: any) => e.Maintenances.length > 0,
  );

  await Api.put('/buildings/maintenances/edit', {
    buildingId,
    data: filteredBuildingMaintenances,
  })
    .then((res) => {
      toast.dismiss();
      navigate(-1);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};
