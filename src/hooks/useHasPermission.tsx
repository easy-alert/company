import { useContext, useEffect, useState, useCallback } from 'react';

import { AuthContext } from '@contexts/Auth/AuthContext';

interface IUseHasPermission {
  permToCheck?: string[];
}

export const useHasPermission = ({ permToCheck }: IUseHasPermission) => {
  const { account } = useContext(AuthContext);

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const checkPermissions = useCallback(() => {
    if (!account) return;

    if (permToCheck?.length === 0) {
      setHasPermission(true);
      return;
    }

    const adminPermission = account?.User?.Permissions?.some(
      (perm) => perm.Permission.name === 'admin:company',
    );

    if (adminPermission) {
      setHasPermission(true);
      return;
    }

    setHasPermission(
      account?.User?.Permissions?.some((perm) =>
        permToCheck?.some((check) => perm.Permission.name.includes(check)),
      ) ?? false,
    );
  }, [account, permToCheck]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return { hasPermission };
};
