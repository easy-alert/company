export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  lastAccess: string;
  isBlocked: boolean;
  Permissions?: [
    {
      Permission: {
        name: string;
      };
    },
  ];
}

export interface IUploadFile {
  Location: string;
  originalname: string;
}

export interface IMask {
  value: string;
  length: number;
}

export interface ITimeInterval {
  id: string;
  name: string;
  singularLabel: string;
  pluralLabel: string;
}

export interface IRequestListIntervals {
  setTimeIntervals: (setTimeIntervals: ITimeInterval[]) => void;
}
