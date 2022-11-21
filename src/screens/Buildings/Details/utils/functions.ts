import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import { IRequestBuildingDetails, IRequestFileUpload, IRequestResendConfirmation } from './types';

export const requestBuildingDetails = async ({
  setLoading,
  buildingId,
  setBuilding,
  setUsedMaintenancesCount,
  setTotalMaintenacesCount,
}: IRequestBuildingDetails) => {
  await Api.get(`/buildings/list/details/${buildingId}`)
    .then((res) => {
      setBuilding(res.data.BuildingDetails);
      setUsedMaintenancesCount(res.data.usedMaintenancesCount);
      setTotalMaintenacesCount(res.data.totalMaintenacesCount);

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
}: IRequestResendConfirmation) => {
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

export const requestResendEmailConfirmation = async ({
  link,
  buildingNotificationConfigurationId,
}: IRequestResendConfirmation) => {
  toast.loading('Enviando...');

  await Api.post('/buildings/notifications/sendconfirm/email', {
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

export const requestFileUpload = async ({ event }: IRequestFileUpload) => {
  const { files } = event.currentTarget;
  const formData = new FormData();

  if (files) {
    for (let i = 0; i < files.length; i += 1) {
      formData.append('files', files[i]);
    }
  }

  // toast.loading('Enviando...');

  // await Api.post('', {
  //   files
  // })
  //   .then((res) => {
  //     toast.dismiss();
  //     toast.success(res.data.ServerMessage.message);
  //   })
  //   .catch((err) => {
  //     catchHandler(err);
  //   });
};

export const insertMiddleEllipsis = (string: string) => {
  if (string.length > 20) {
    return `${string.substring(0, 20)}...${string.substring(string.length - 4, string.length)}`;
  }
  return string;
};
