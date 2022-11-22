export interface IModalAddFiles {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenacesCount: (setTotalMaintenacesCount: number) => void;
}

export interface IRequestRegisterBuildingFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any;
  fileName: string;
  buildingId: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenacesCount: (setTotalMaintenacesCount: number) => void;
  setModal: (setModal: boolean) => void;
}
