import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestMaintenanceDetails } from './types';

export const requestMaintenanceDetails = async ({
  maintenanceHistoryId,
  setMaintenance,
  setModalLoading,
}: IRequestMaintenanceDetails) => {
  await Api.get(`maintenances/list/details/${maintenanceHistoryId}`)
    .then((res) => {
      console.log(res.data);

      setMaintenance(res.data);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setModalLoading(false);
    });
};
