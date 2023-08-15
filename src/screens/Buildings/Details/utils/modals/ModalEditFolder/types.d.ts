import { Folder, IBuildingDetail } from '../../types';

export interface IModalEditFolder {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  folder: Folder;
}

export interface IRequestEditFolder {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  name: string;
  folderId: string;
}
