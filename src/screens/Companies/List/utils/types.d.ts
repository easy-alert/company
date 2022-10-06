/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserCompanies {
  User: {
    id: string;
    name: string;
    email: string;
    lastAccess: string | null;
  };
}

export interface ICompany {
  id: string;
  image: string;
  name: string;
  contactNumber: string;
  CNPJ: string;
  CPF: string;
  isBlocked: boolean;
  createdAt: string;
  UserCompanies: IUserCompanies[];
}

export interface IRequestUsersList {
  setCompanies: (setCompanies: ICompany[]) => void;
  setLoading?: (setLoading: boolean) => void;
  page: number;
  setCount: (setCount: number) => void;
  filter?: string;
  setPage?: (setPage: number) => void;
}

// YUP
export interface IFormDataCompany {
  image: string;
  name: string;
  email: string;
  companyName: string;
  contactNumber: string;
  CPF: string;
  CNPJ: string;

  password: string;
  confirmPassword: string;
}
