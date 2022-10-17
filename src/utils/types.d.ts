export interface IAccount {
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
