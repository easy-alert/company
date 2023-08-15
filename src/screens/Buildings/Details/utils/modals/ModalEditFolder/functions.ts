import * as yup from 'yup';
import { catchHandler } from '../../../../../../utils/functions';
import { Api } from '../../../../../../services/api';
import { IRequestEditFolder } from './types';

export const schemaEditFolder = yup
  .object({
    name: yup.string().required('Campo obrigatório.'),
  })
  .required();

export const requestEditFolder = async ({
  setModal,
  setOnQuery,
  setBuilding,
  folderId,
  name,
}: IRequestEditFolder) => {
  setOnQuery(true);

  await Api.put('/buildings/folders/edit', {
    name,
    folderId,
  })
    .then(() => {
      setModal(false);
      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          if (newState.Folders) {
            const folderIndex = newState.Folders.Folders.findIndex((e) => e.id === folderId);
            newState.Folders.Folders[folderIndex].name = name;
          }

          return newState;
        }
        return undefined;
      });
    })
    .catch((err) => {
      catchHandler(err);
    })
    .finally(() => {
      setOnQuery(false);
    });
};
