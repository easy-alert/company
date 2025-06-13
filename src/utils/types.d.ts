interface IUserCompany {
  id: string;
  name: string;
  email?: string;
  emailIsConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberIsConfirmed: boolean;
  role?: string;
  image?: string;
  lastAccess: string | null;
  createdAt: string;
  isBlocked: boolean;
}

interface IUserCompanyRelation {
  User: IUserCompany;
}

export type TTranslateTicketType = 'none' | 'whatsapp' | 'email' | 'link' | 'platform';

export type TOrigin = 'Backoffice' | 'Company' | 'Client' | 'App' | '';

export interface IAccount {
  origin: TOrigin;

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
    canAccessChecklists: boolean;
    canAccessTickets: boolean;
  };

  Companies?: {
    Company: {
      id: string;
      name: string;
      contactNumber: string;
      CNPJ?: string;
      CPF?: string;
      createdAt: string;
      image: string;
      isBlocked: boolean;
      ticketType: TTranslateTicketType;
      ticketInfo: string | null;
    };
  }[];

  User: {
    id: string;

    name: string;
    email: string;
    emailIsConfirmed: boolean;
    phoneNumber: string;
    phoneNumberIsConfirmed: boolean;
    image?: string;
    colorScheme?: string;
    role?: string;

    isBlocked: boolean;
    isCompanyOwner: boolean;

    lastAccess: string;

    Permissions?: [
      {
        Permission: {
          name: string;
        };
      },
    ];

    BuildingsPermissions?: {
      Building: {
        id: string;
        name: string;
      };
    }[];

    createdAt: string;
    updatedAt: string;
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
