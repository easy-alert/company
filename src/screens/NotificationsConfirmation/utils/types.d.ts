export interface IRequestConfirmPhone {
  token: string;
  setIsConfirmed: (setIsConfirmed: boolean) => void;
}

export interface IRequestGetBuildingName {
  setBuildingName: (setBuildingName: string) => void;
  setLoading: (setLoading: boolean) => void;
  token: string;
}
