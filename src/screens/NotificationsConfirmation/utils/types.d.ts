export interface IRequestConfirmPhone {
  navigate: any;
  token: string;
  setIsConfirmed: (setIsConfirmed: boolean) => void;
  setOnQuery: (setOnQuery: boolean) => void;
}

export interface IRequestGetBuildingName {
  setBuildingName: (setBuildingName: string) => void;
  setCompanyImage: (setCompanyImage: string) => void;
  setLoading: (setLoading: boolean) => void;
  token: string;
}
