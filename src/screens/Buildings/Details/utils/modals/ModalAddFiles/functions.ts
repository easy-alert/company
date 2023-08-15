import { toast } from 'react-toastify';
import { Api } from '../../../../../../services/api';
import { catchHandler } from '../../../../../../utils/functions';
import { IRequestRegisterBuildingFile } from './types';

export const requestRegisterBuildingFile = async ({
  files,
  setOnQuery,
  buildingId,
  setModal,
}: IRequestRegisterBuildingFile) => {
  if (files.length === 0) {
    toast.error('O anexo é obrigatório.');
    return;
  }

  setOnQuery(true);

  // const teste = await uploadManyFiles(files);

  setOnQuery(false);

  await Api.post('/buildings/annexes/create', {
    buildingId,
  })
    .then((res) => {
      // add pelo front?
      setModal(false);
      toast.success(res.data.ServerMessage.message);
    })
    .catch((err) => {
      setOnQuery(false);
      catchHandler(err);
    });
};

export const insertMiddleEllipsis = (string: string) => {
  if (string.length > 50) {
    return `${string.substring(0, 30)}...${string.substring(string.length - 10, string.length)}`;
  }
  return string;
};
