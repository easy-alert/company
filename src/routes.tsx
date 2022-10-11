import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// COMPONENTS
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { Sidebar } from './components/Sidebar';

// AUTHENTICATION
import { Login } from './screens/Authentication/Login';

import { UserDetails } from './screens/User/Details';
import { MaintenancesList } from './screens/Maintenances/List';
import { BuildingsList } from './screens/Buildings/List';
import { BuildingCreate } from './screens/Buildings/Create';

const AppRoutes = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Login />} />

        <Route
          path="/"
          element={
            <Sidebar>
              <RequireAuth />
            </Sidebar>
          }
        >
          <Route path="/user" element={<UserDetails />} />

          <Route path="/maintenances" element={<MaintenancesList />} />

          <Route path="/buildings" element={<Outlet />}>
            <Route index element={<BuildingsList />} />
            <Route path="create" element={<BuildingCreate />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoutes;
