import { toast } from 'react-toastify';
import { Api } from '../../../../services/api';
import { catchHandler } from '../../../../utils/functions';
import {
  IChangeShowContactStatus,
  IRequestBuildingDetails,
  IRequestFolderDetails,
  IRequestResendConfirmation,
} from './types';

export const requestBuildingDetails = async ({
  setLoading,
  buildingId,
  setBuilding,
  setUsedMaintenancesCount,
  setTotalMaintenancesCount,
  setRootFolderId,
}: IRequestBuildingDetails) => {
  await Api.get(`/buildings/list/details/${buildingId}`)
    .then((res) => {
      setBuilding(res.data.BuildingDetails);
      setUsedMaintenancesCount(res.data.usedMaintenancesCount);
      setTotalMaintenancesCount(res.data.totalMaintenancesCount);
      setRootFolderId(res.data.BuildingDetails.Folders.id);
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      if (setLoading) setLoading(false);
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

export const requestFolderDetails = async ({ folderId, setBuilding }: IRequestFolderDetails) => {
  await Api.get(`/buildings/folders/list/${folderId}`)
    .then((res) => {
      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          newState.Folders = res.data;

          return newState;
        }
        return undefined;
      });
    })
    .catch((err) => {
      catchHandler(err);
    });
};
