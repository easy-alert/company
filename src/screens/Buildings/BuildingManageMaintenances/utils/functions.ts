/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import {
  IRequestManageBuildingMaintenances,
  IRequestListCategoriesToManage,
  IRequestBuildingListForSelect,
  IRequestCategoriesForSelect,
  IFilterFunction,
} from './types';

export const requestListCategoriesToManage = async ({
  setLoading,
  setCategories,
  buildingId,
  setTableLoading,
  setBuildingName,
  currentBuildingId,
  setCategoriesForFilter,
}: IRequestListCategoriesToManage) => {
  if (setTableLoading) setTableLoading(true);

  await Api.post(`/buildings/maintenances/list`, {
    buildingId,
    currentBuildingId,
  })
    .then((res) => {
      setBuildingName(res.data.buildingName);
      setCategories(res.data.CategoriesData);
      setCategoriesForFilter(res.data.CategoriesData);
      setLoading(false);
      if (setTableLoading) setTableLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      if (setTableLoading) setTableLoading(false);
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

  categories.forEach((category) => {
    buildingMaintenances.push({ categoryId: category.id, Maintenances: category.Maintenances });
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
      navigate(`/buildings/details/${buildingId}`);
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
  await Api.get(`/buildings/listforselect/${buildingId}`)
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

export const filterFunction = ({ categoriesForFilter, setCategories, filter }: IFilterFunction) => {
  if (filter !== '') {
    setCategories((prevState) => {
      let newState = [...prevState];
      newState = categoriesForFilter.filter((e) =>
        String(e.name).toLowerCase().includes(String(filter).toLowerCase()),
      );
      return newState;
    });
  } else {
    setCategories((prevState) => {
      let newState = [...prevState];
      newState = categoriesForFilter;
      return newState;
    });
  }
};
