import { Banner } from '../../../types';

export interface IModalAddBanners {
  setModal: (setModal: boolean) => void;
  buildingId: string;
  currentBanners: Banner[];
  requestBuildingDetailsCall: () => Promise<void>;
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
  setModal: (setModal: boolean) => void;
  webBanner: IImage[];
  mobileBanner: IImage[];
  requestBuildingDetailsCall: () => Promise<void>;
}

export interface IData {
  buildingId: string;
  redirectUrl: string | null;
  bannerName: string | null;
  originalName: string | null;
  type: 'Web' | 'Mobile' | null;
  url: string | null;
}
