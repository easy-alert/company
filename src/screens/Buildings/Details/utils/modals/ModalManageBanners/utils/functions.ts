import { toast } from 'react-toastify';
import { Api } from '../../../../../../../services/api';
import { catchHandler, uploadFile } from '../../../../../../../utils/functions';
import { requestBuildingDetails } from '../../../functions';
import { IRequestRegisterBuildingBanners } from './types';

export const requestRegisterBuildingBanners = async ({
  files,
  fileName,
  setOnQuery,
  buildingId,
  setBuilding,
  setTotalMaintenancesCount,
  setUsedMaintenancesCount,
  setModal,
}: IRequestRegisterBuildingBanners) => {
  if (fileName === '') {
    toast.error('O nome do anexo é obrigatório.');
    return;
  }

  if (files.length === 0) {
    toast.error('O anexo é obrigatório.');
    return;
  }

  setOnQuery(true);

  const { Location: fileUrl, originalname: originalName } = await uploadFile(files[0]);

  await Api.post('/buildings/annexes/create', {
    name: fileName,
    url: fileUrl,
    originalName,
    buildingId,
  })
    .then((res) => {
      requestBuildingDetails({
        buildingId,
        setBuilding,
        setTotalMaintenancesCount,
        setUsedMaintenancesCount,
      });
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};
