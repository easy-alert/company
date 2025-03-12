import { IAccount } from '@utils/types';

export interface IAuthContext {
  account: IAccount | null;
  setAccount: (setUser: IAccount) => void;
  signin: (ILoginRequestResponse) => void;
  signout: () => void;
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
