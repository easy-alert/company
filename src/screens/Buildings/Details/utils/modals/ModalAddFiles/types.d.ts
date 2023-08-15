import { IBuildingDetail } from '../../types';

export interface IModalAddFiles {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
}

export interface IRequestRegisterBuildingFile {
  files: any;
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setModal: (setModal: boolean) => void;
  setBuilding: React.Dispatch<React.SetStateAction<IBuildingDetail | undefined>>;
}
