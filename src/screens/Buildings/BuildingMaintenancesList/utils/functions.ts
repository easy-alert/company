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
    setAddedMaintenances(() => {
      let newState = [...addedMaintenancesForFilter];
      newState = newState
        .map((item) => ({
          ...item,
          Maintenances: item.Maintenances.filter((maintenance) => {
            const m = maintenance.Maintenance;
            return (
              m.element.toLowerCase().includes(filter.toLowerCase()) ||
              m.activity.toLowerCase().includes(filter.toLowerCase()) ||
              m.frequency.toString().includes(filter) ||
              m.responsible.toLowerCase().includes(filter.toLowerCase()) ||
              m.source.toLowerCase().includes(filter.toLowerCase())
            );
          }),
        }))
        .filter(
          (item) =>
            item.Maintenances.length > 0 ||
            item.Category.name.toLowerCase().includes(filter.toLowerCase()),
        );
      return newState;
    });
  } else {
    setAddedMaintenances(addedMaintenancesForFilter);
  }
};
