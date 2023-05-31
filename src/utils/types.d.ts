export interface IAccount {
  origin: 'Backoffice' | 'Company' | 'Client';
  User: {
    id: string;
    lastAccess: string;
    name: string;
    email: string;
    createdAt: string;
    Permissions?: [
      {
        Permission: {
          name: string;
        };
      },
    ];
  };
  Company: {
    id: string;
    name: string;
    contactNumber: string;
    CNPJ?: string;
    CPF?: string;
    createdAt: string;
    image: string;
    supportLink: string;
  };
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

export interface IBuildingTypes {
  id: string;
  name: string;
}

export interface IRequestBuildingTypes {
  setBuildingTypes: (setBuildingTypes: IBuildingTypes[]) => void;
}

export interface IRequestAddressData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: any;
  cep: string;
}

export interface IIncreaseDaysInDate {
  daysToIncrease: number;
  date: Date;
}
