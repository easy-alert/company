import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestMaintenanceDetails } from './types';

export const requestMaintenanceDetails = async ({
  maintenanceHistoryId,
  setMaintenance,
  setLoading,
}: IRequestMaintenanceDetails) => {
  await Api.get(`maintenances/list/details/${maintenanceHistoryId}`)
    .then((res) => {
      setMaintenance(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setLoading(false);
    });
};
