import { IAccount } from '../../../utils/types';

export interface IAuthContext {
  account: IAccount;
  setAccount: (setUser: IAccount) => void;
  signin: (ILoginRequestResponse) => void;
  signout: () => void;
  handleChangeUser: (user: IAccount['User']) => void;
  handleChangeCompany: (company: IAccount['Company']) => void;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginRequestResponse {
  Account: IAccount;
  token: string;
}

export interface IRequireAuth {
  children: JSX.Element;
}
