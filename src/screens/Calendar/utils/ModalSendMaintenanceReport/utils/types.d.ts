export interface IModalSendMaintenanceReport {
  setModal: (setModal: boolean) => void;
  selectedMaintenanceId: string;
  selectedBuildingId: string;
}

export interface IFileAndImage {
  name: string;
  url: string;
}
