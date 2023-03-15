/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IFilterFunction, IRequestAddedMaintenances } from './types';

export const requestAddedMaintenances = async ({
  setLoading,
  setAddedMaintenances,
  buildingId,
  setBuildingName,
  setAddedMaintenancesForFilter,
}: IRequestAddedMaintenances) => {
  await Api.get(`/buildings/list/details/${buildingId}/maintenances`)
    .then((res) => {
      setBuildingName(res.data.buildingName);
      setAddedMaintenances(res.data.BuildingMaintenances);
      setAddedMaintenancesForFilter(res.data.BuildingMaintenances);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      if (setLoading) setLoading(false);
      catchHandler(err);
    });
};

export const filterFunction = ({
  addedMaintenancesForFilter,
  setAddedMaintenances,
  filter,
}: IFilterFunction) => {
  if (filter !== '') {
    setAddedMaintenances((prevState) => {
      let newState = [...prevState];
      newState = addedMaintenancesForFilter.filter((e) =>
        String(e.Category.name).toLowerCase().includes(String(filter).toLowerCase()),
      );
      return newState;
    });
  } else {
    setAddedMaintenances((prevState) => {
      let newState = [...prevState];
      newState = addedMaintenancesForFilter;
      return newState;
    });
  }
};
