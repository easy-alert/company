import * as yup from 'yup';
import { catchHandler } from '../../../../../../utils/functions';
import { Api } from '../../../../../../services/api';
import { IRequestEditFile } from './types';

export const schemaEditFile = yup
  .object({
    name: yup.string().required('Campo obrigatório.'),
  })
  .required();

export const requestEditFile = async ({
  setModal,
  setOnQuery,
  setBuilding,
  name,
  fileId,
}: IRequestEditFile) => {
  setOnQuery(true);

  await Api.put('/buildings/folders/files/edit', {
    name,
    fileId,
  })
    .then(() => {
      setModal(false);
      setBuilding((prevState) => {
        if (prevState) {
          const newState = { ...prevState };

          if (newState.Folders) {
            const fileIndex = newState.Folders.Files.findIndex((e) => e.id === fileId);
            newState.Folders.Files[fileIndex].name = name;
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
