import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestBuildingList } from './types';

export const requestBuildingList = async ({
  setBuildingList,
  setCount,
  setLoading,
  setPage,
  page = 1,
  filter = '',
  resetPage,
}: IRequestBuildingList) => {
  await Api.get(`/buildings/list?page=${page}&search=${filter}`)
    .then((res) => {
      setBuildingList(res.data.Buildings);
      setCount(res.data.buildingsCount);
      if (resetPage && setPage) setPage(1);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      if (setLoading) setLoading(false);
    });
};
