import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@contexts/Auth/AuthContext';

interface IUseHasPermission {
  pagePermission?: string;
}

export const useHasPermission = ({ pagePermission }: IUseHasPermission) => {
  const { account } = useContext(AuthContext);

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    if (!account) return;

    const adminPermission = account?.User?.Permissions?.some((perm) =>
      perm.Permission.name.includes('admin'),
    );

    if (adminPermission) {
      setHasPermission(true);
      return;
    }

    setHasPermission(
      account?.User?.Permissions?.some((perm) => perm.Permission.name === pagePermission) ?? false,
    );
  }, []);

  return { hasPermission };
};
