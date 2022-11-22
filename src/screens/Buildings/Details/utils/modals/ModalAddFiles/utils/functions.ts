import { toast } from 'react-toastify';
import { Api } from '../../../../../../../services/api';
import { catchHandler, uploadFile } from '../../../../../../../utils/functions';
import { requestBuildingDetails } from '../../../functions';
import { IRequestRegisterBuildingFile } from './types';

export const requestRegisterBuildingFile = async ({
  files,
  fileName,
  setOnQuery,
  buildingId,
  setBuilding,
  setTotalMaintenacesCount,
  setUsedMaintenancesCount,
  setModal,
}: IRequestRegisterBuildingFile) => {
  if (fileName === '') {
    toast.error('O nome do anexo é obrigatório.');
    return;
  }

  if (files.length === 0) {
    toast.error('O anexo é obrigatório.');
    return;
  }

  setOnQuery(true);

  const { Location: fileUrl } = await uploadFile(files[0]);

  await Api.post('/buildings/annexes/create', {
    name: fileName,
    url: fileUrl,
    buildingId,
  })
    .then((res) => {
      requestBuildingDetails({
        buildingId,
        setBuilding,
        setTotalMaintenacesCount,
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
