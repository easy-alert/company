import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import {
  IChangeShowContactStatus,
  IRequestBuildingDetails,
  IRequestDeleteAnnex,
  IRequestResendConfirmation,
} from './types';

export const requestBuildingDetails = async ({
  setLoading,
  buildingId,
  setBuilding,
  setUsedMaintenancesCount,
  setTotalMaintenancesCount,
}: IRequestBuildingDetails) => {
  await Api.get(`/buildings/list/details/${buildingId}`)
    .then((res) => {
      setBuilding(res.data.BuildingDetails);
      setUsedMaintenancesCount(res.data.usedMaintenancesCount);
      setTotalMaintenancesCount(res.data.totalMaintenancesCount);

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

export const requestDeleteAnnex = async ({
  annexeId,
  setDeleteAnnexOnQuery,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
}: IRequestDeleteAnnex) => {
  toast.loading('Excluindo anexo...');
  setDeleteAnnexOnQuery(true);

  await Api.delete('/buildings/annexes/delete', {
    data: {
      annexeId,
    },
  })
    .then((res) => {
      toast.dismiss();
      toast.success(res.data.ServerMessage.message);
      requestBuildingDetails({
        buildingId,
        setBuilding,
        setTotalMaintenancesCount,
        setUsedMaintenancesCount,
      }).finally(() => {
        setDeleteAnnexOnQuery(false);
      });
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const changeShowContactStatus = async ({
  buildingNotificationConfigurationId,
  showContact,
  setShowContactLoading,
}: IChangeShowContactStatus) => {
  setShowContactLoading(true);

  await Api.put('/buildings//notifications/change/showcontact', {
    buildingNotificationConfigurationId,
    showContact,
  })

    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setShowContactLoading(false);
    });
};
