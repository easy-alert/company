export interface IModalPrintQRCode {
  setModal: (setModal: boolean) => void;
  buildingName: string;
  buildingNanoId: string;
  notificationsConfigurations: {
    nanoId: string;
    name: string;
  }[];
}
