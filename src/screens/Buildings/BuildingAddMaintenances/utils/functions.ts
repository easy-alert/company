/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import {
  ICategories,
  ICategoriesResData,
  IRequestAddMaintenancesToBuilding,
  IRequestCategories,
} from './types';

export const requestCategories = async ({
  setLoading,
  setCategories,
  filter = '',
}: IRequestCategories) => {
  await Api.get(`/categories/list?search=${filter}`)
    .then((res: ICategoriesResData) => {
      const updatedCategories: ICategories[] = [];

      res.data.forEach((category, i: number) => {
        updatedCategories.push({
          id: category.id,
          name: category.name,
          ownerCompanyId: category.ownerCompanyId,
          Maintenances: [],
        });

        category.Maintenances.forEach((maintenance) => {
          updatedCategories[i].Maintenances.push({
            isSelected: false,
            activity: maintenance.activity,
            delay: maintenance.delay,
            DelayTimeInterval: maintenance.DelayTimeInterval,
            element: maintenance.element,
            frequency: maintenance.frequency,
            FrequencyTimeInterval: maintenance.FrequencyTimeInterval,
            id: maintenance.id,
            observation: maintenance.observation,
            ownerCompanyId: maintenance.ownerCompanyId,
            period: maintenance.period,
            PeriodTimeInterval: maintenance.PeriodTimeInterval,
            responsible: maintenance.responsible,
            source: maintenance.source,
          });
        });
      });

      setCategories([...updatedCategories]);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      catchHandler(err);
    });
};

export const requestAddMaintenancesToBuilding = async ({
  categories,
  buildingId,
  navigate,
  setOnQuery,
}: IRequestAddMaintenancesToBuilding) => {
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

  await Api.post('/buildings/categories/create', {
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
