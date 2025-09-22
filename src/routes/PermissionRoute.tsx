import { useContext } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '@contexts/Auth/AuthContext';

interface IPermissionRoute {
  requiredPermission: string;
}

const PermissionRoute = ({ requiredPermission }: IPermissionRoute) => {
  const { account } = useContext(AuthContext);

  if (!account?.User) {
    return <Navigate to="/forbidden" replace />;
  }

  const userPermissions = account.User.Permissions?.map((p) => p.Permission.name) || [];
  const isAdmin = userPermissions.includes('admin:company');

  // Se for admin, sempre tem acesso
  if (isAdmin) {
    return <Outlet />;
  }

  // Lógica especial para o calendário: aceita access:calendarMaintenances OU access:tickets
  if (requiredPermission === 'access:calendarMaintenances') {
    const hasCalendarMaintenances = userPermissions.includes('access:calendarMaintenances');
    const hasTickets = userPermissions.includes('access:tickets');
    
    if (!hasCalendarMaintenances && !hasTickets) {
      return <Navigate to="/forbidden" replace />;
    }
  } else {
    // Lógica padrão para outras permissões
    if (!userPermissions.includes(requiredPermission)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
};

export default PermissionRoute;
