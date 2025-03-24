// LIBS
import { useState } from 'react';

// TYPES
import { IAccount } from '../../utils/types';
import { AuthContext } from './AuthContext';
import type { ILoginRequestResponse } from './utils/types';
import { query } from '../../utils/functions';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [account, setAccount] = useState<IAccount>({} as IAccount);

  const signin = async ({ Account, token }: ILoginRequestResponse) => {
    localStorage.setItem('authToken', token);
    setAccount(Account);
  };

  const signout = () => {
    query.delete('backofficeToken');
    query.delete('userId');

    setAccount({} as IAccount);
    localStorage.removeItem('authToken');
  };

  const handleChangeUser = (user: IAccount['User']) => {
    setAccount((prev) => ({
      ...prev,
      User: {
        ...prev.User,
        ...user,
      },
    }));
  };

  const handleChangeCompany = (company: IAccount['Company']) => {
    setAccount((prev) => ({
      ...prev,
      Company: {
        ...prev.Company,
        ...company,
      },
    }));
  };

  const handleChangeCompanyUsers = (users: IAccount['Company']['UserCompanies']) => {
    setAccount((prev) => ({
      ...prev,
      Company: {
        ...prev.Company,
        UserCompanies: users,
      },
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        setAccount,
        signin,
        signout,
        handleChangeUser,
        handleChangeCompany,
        handleChangeCompanyUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
