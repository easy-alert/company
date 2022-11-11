import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestBuildingDetails, IRequestResendPhoneConfirmation } from './types';

export const requestBuildingDetails = async ({
  setLoading,
  buildingId,
  setBuilding,
}: IRequestBuildingDetails) => {
  await Api.get(`/buildings/list/details/${buildingId}`)
    .then((res) => {
      setBuilding(res.data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      if (setLoading) setLoading(false);
      catchHandler(err);
    });
};

export const requestResendPhoneConfirmation = async ({
  link,
  buildingNotificationConfigurationId,
}: IRequestResendPhoneConfirmation) => {
  toast.loading('Enviando...');

  await Api.post('/buildings/notifications/sendconfirm/phone', {
    link,
    buildingNotificationConfigurationId,
  })
    .then((res) => {
      toast.dismiss();
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
