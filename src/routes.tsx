import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// COMPONENTS
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { Sidebar } from './components/Sidebar';

// AUTHENTICATION
import { Login } from './screens/Authentication/Login';

import { CompaniesList } from './screens/Companies/List';
import { CompanyDetails } from './screens/Companies/Details';
import { MaintenancesList } from './screens/Maintenances/List';
import { BuildingsList } from './screens/Buildings/List';

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
          <Route path="/user" element={<Outlet />}>
            <Route index element={<CompaniesList />} />
            <Route path=":user_id" element={<CompanyDetails />} />
          </Route>

          <Route path="/maintenances" element={<MaintenancesList />} />

          <Route path="/buildings" element={<BuildingsList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoutes;
