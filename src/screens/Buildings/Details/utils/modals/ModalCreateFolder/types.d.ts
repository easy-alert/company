import { IBuildingDetail } from '../../types';

export interface IModalCreateFolder {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  buildingId: string;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  parentId: string | null;
}

export interface IRequestCreateFolder {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOnQuery: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  buildingId: string;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
  parentId: string | null;
}
