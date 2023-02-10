export interface IModalAddBanners {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
}

export interface IImage {
  name: string;
  url: string;
}

export interface IRequestRegisterBuildingBanners {
  buildingId: string;
  bannerName: string;
  bannerLink: string;
  setOnQuery: (setOnQuery: boolean) => void;
  setBuilding: (setBuilding: IBuildingDetail) => void;
  setUsedMaintenancesCount: (setUsedMaintenancesCount: number) => void;
  setTotalMaintenancesCount: (setTotalMaintenancesCount: number) => void;
  setModal: (setModal: boolean) => void;
  webBanner: IImage[];
  mobileBanner: IImage[];
}

export interface IData {
  buildingId: string;
  redirectUrl: string | null;
  bannerName: string | null;
  originalName: string;
  type: 'Web' | 'Mobile';
  url: string;
}
