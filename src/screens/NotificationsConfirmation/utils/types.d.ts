export interface IRequestConfirmPhone {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  token: string;
  setIsConfirmed: (setIsConfirmed: boolean) => void;
}

export interface IRequestGetBuildingName {
  setBuildingName: (setBuildingName: string) => void;
  setLoading: (setLoading: boolean) => void;
  token: string;
}
