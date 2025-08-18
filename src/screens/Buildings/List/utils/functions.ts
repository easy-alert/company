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
  filterType = '',
  resetPage,
}: IRequestBuildingList) => {
  const uri = `/buildings/list`;

  const params = {
    page,
    search: filter,
    filterBy: filterType,
  };

  await Api.get(uri, { params })
    .then((res) => {
      setBuildingList(res.data.buildings);
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
