import { toast } from 'react-toastify';
import { Api } from '@services/api';
import { catchHandler } from '@utils/functions';
import {
  IBuildingDetail,
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
  setRootFolder,
}: IRequestBuildingDetails) => {
  await Api.get(`/buildings/list/details/${buildingId}`)
    .then((res) => {
      setBuilding(res.data.BuildingDetails);
      setRootFolder(res.data.BuildingDetails.Folders);
      setUsedMaintenancesCount(res.data.usedMaintenancesCount);
      setTotalMaintenancesCount(res.data.totalMaintenancesCount);
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

  await Api.put('/buildings/notifications/change/showcontact', {
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

export const requestFolderDetails = async ({
  folderId,
  setBuilding,
  setBreadcrumb,
  rootFolder,
}: IRequestFolderDetails) => {
  await Api.get(`/buildings/folders/list/${folderId}`)
    .then(({ data }) => {
      const breadcrumb = [
        {
          id: data?.Parent?.id || null,
          name: data?.Parent?.name || null,
        },
        {
          id: data.id,
          name: data.name,
        },
      ].filter((e) => e.id);

      if (breadcrumb[0].id !== rootFolder.id) {
        breadcrumb.unshift({
          id: rootFolder.id,
          name: rootFolder.name,
        });
      }

      setBreadcrumb(breadcrumb);

      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          newState.Folders = data;

          return newState;
        }
        return undefined;
      });
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const requestDeleteFolder = async ({
  folderId,
  setBuilding,
}: {
  folderId: string;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
}) => {
  await Api.delete(`/buildings/folders/delete/${folderId}`)
    .then(() => {
      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          if (newState.Folders) {
            newState.Folders.Folders = newState.Folders.Folders.filter((e) => e.id !== folderId);
          }

          return newState;
        }
        return undefined;
      });
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const requestDeleteFile = async ({
  folderId: fileId,
  setBuilding,
}: {
  folderId: string;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
}) => {
  await Api.delete(`/buildings/folders/files/delete/${fileId}`)
    .then(() => {
      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          if (newState.Folders) {
            newState.Folders.Files = newState.Folders.Files.filter((e) => e.id !== fileId);
          }

          return newState;
        }
        return undefined;
      });
    })
    .catch((err) => {
      catchHandler(err);
    });
};

export const deleteBanner = async (id: string) => {
  await Api.delete(`/buildings/banners/delete/${id}`)
    .then((res) => {
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      catchHandler(err);
    });
};
