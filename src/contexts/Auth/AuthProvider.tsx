// LIBS
import { useState } from 'react';

// FUNCTIONS
import { setToken } from './utils/functions';

// TYPES
import { IAccount } from '../../utils/types';
import { AuthContext } from './AuthContext';
import { ILoginRequestResponse } from './utils/types';
import { query } from '../../utils/functions';

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [account, setAccount] = useState<IAccount | null>(null);

  const signin = async ({ Account, token }: ILoginRequestResponse) => {
    setAccount(Account);
    setToken({ token });
  };

  const signout = () => {
    query.delete('backofficeToken');
    query.delete('userId');
    setAccount(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ account, setAccount, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
