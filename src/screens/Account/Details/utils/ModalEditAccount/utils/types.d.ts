/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAccount } from '../../../../../../utils/types';

interface IFormEditAccount {
  image: string;
  name: string;
  email: string;
  companyName: string;
  contactNumber: string;
  CPF: string;
  CNPJ: string;
  password: string;
  supportLink: string;
}

export interface IModalEditAccount {
  account: IAccount;
  setAccount: (setCompany: IAccount) => void;
  setModal: (setModal: boolean) => void;
}

// REQUESTS
export interface IRequestEditAccount {
  values: IFormEditAccount;
  account: IAccount;
  setAccount: (setCompany: IAccount) => void;
  setOnQuery: (setOnQuery: boolean) => void;
  navigate: any;
  setModal: (setModal: boolean) => void;
}
