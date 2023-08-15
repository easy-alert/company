import { toast } from 'react-toastify';
import { Api } from '../../../../../../services/api';
import { catchHandler, uploadManyFiles } from '../../../../../../utils/functions';
import { IRequestRegisterBuildingFile } from './types';

export const requestRegisterBuildingFile = async ({
  files,
  setOnQuery,
  folderId,
  setModal,
  setBuilding,
}: IRequestRegisterBuildingFile) => {
  if (files.length === 0) {
    toast.error('O anexo é obrigatório.');
    return;
  }

  setOnQuery(true);

  const uploadedFiles = await uploadManyFiles(files);

  const formattedFiles = uploadedFiles.map((file) => ({
    name: file.originalname,
    url: file.Location,
    folderId,
  }));

  await Api.post('/buildings/folders/files/create', {
    files: formattedFiles,
  })
    .then(({ data }) => {
      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          if (newState.Folders) {
            newState.Folders.Files = [...data, ...newState.Folders.Files];
          }

          return newState;
        }
        return undefined;
      });

      setModal(false);
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
