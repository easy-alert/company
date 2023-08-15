import { File, IBuildingDetail } from '../../types';

export interface IModalEditFile {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  file: File;
}

export interface IRequestEditFile {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  name: string;
  fileId: string;
}
