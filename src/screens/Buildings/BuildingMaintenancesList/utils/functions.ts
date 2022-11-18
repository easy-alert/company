/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestAddedMaintenances } from './types';

export const requestAddedMaintenances = async ({
  setLoading,
  setAddedMaintenances,
  filter = '',
  buildingId,
}: IRequestAddedMaintenances) => {
  await Api.get(`/buildings/list/details/${buildingId}/maintenances?search=${filter}`)
    .then((res) => {
      setAddedMaintenances(res.data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      if (setLoading) setLoading(false);
      catchHandler(err);
    });
};
