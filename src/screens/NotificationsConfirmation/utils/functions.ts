import { Api } from '../../../services/api';
import { catchHandler } from '../../../utils/functions';
import { IRequestConfirmPhone, IRequestGetBuildingName } from './types';

export const requestConfirmData = async ({
  token,
  setIsConfirmed,
  navigate,
  setOnQuery,
}: IRequestConfirmPhone) => {
  setOnQuery(true);

  await Api.post('/buildings/notifications/contactconfirm', {
    token,
  })
    .then(() => {
      setIsConfirmed(true);
    })
    .catch((err) => {
      catchHandler(err);
      navigate('/login');
    })
    .finally(() => {
      setOnQuery(false);
    });
};

export const requestGetBuildingName = async ({
  setBuildingName,
  setLoading,
  token,
}: IRequestGetBuildingName) => {
  await Api.post('buildings/list/detailsforconfirm', { token })
    .then((res) => {
      setBuildingName(res.data.BuildingDetails.name);
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      catchHandler(err);
    });
};
