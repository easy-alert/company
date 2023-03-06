/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestAddedMaintenances } from './types';

export const requestAddedMaintenances = async ({
  setLoading,
  setAddedMaintenances,
  buildingId,
  setBuildingName,
}: IRequestAddedMaintenances) => {
  await Api.get(`/buildings/list/details/${buildingId}/maintenances`)
    .then((res) => {
      setBuildingName(res.data.buildingName);
      setAddedMaintenances(res.data.BuildingMaintenances);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      if (setLoading) setLoading(false);
      catchHandler(err);
    });
};
