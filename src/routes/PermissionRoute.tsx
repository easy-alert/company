import { useContext } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '@contexts/Auth/AuthContext';

interface IPermissionRoute {
  requiredPermission: string;
}

const PermissionRoute = ({ requiredPermission }: IPermissionRoute) => {
  const { account } = useContext(AuthContext);

  if (
    !account?.User ||
    (!account?.User.Permissions?.some((perm) => perm.Permission.name === requiredPermission) &&
      !account?.User.Permissions?.some((perm) => perm.Permission.name === 'admin:company'))
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default PermissionRoute;
