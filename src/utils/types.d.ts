interface IUserCompany {
  id: string;
  name: string;
  email: string;
  lastAccess: string | null;
  createdAt: string;
  isBlocked: boolean;
}

interface IUserCompanyRelation {
  User: IUserCompany;
}

export type TTranslateTicketType = 'none' | 'whatsapp' | 'email' | 'link' | 'platform';

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
    ticketType: TTranslateTicketType;
    ticketInfo: string | null;
    UserCompanies: IUserCompanyRelation[];
    showMaintenancePriority: boolean;
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
  unitTime: number;
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
  setApiError: (setApiError: boolean) => void;
}

export interface IIncreaseDaysInDate {
  daysToIncrease: number;
  date: Date;
}
