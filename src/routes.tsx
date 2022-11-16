import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// COMPONENTS
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { Sidebar } from './components/Sidebar';

// AUTHENTICATION
import { Login } from './screens/Authentication/Login';

// ACCOUNT
import { AccountDetails } from './screens/Account/Details';

// MAINTENANCES
import { MaintenancesList } from './screens/Maintenances/List';

// BUILDINGS
import { BuildingsList } from './screens/Buildings/List';
import { BuildingDetails } from './screens/Buildings/Details';
import { AddMaintenances } from './screens/Buildings/AddMaintenances';

// NOTIFICATIONS CONFIRMATION
import { PhoneConfirm } from './screens/NotificationsConfirmation/Phone';
import { EmailConfirm } from './screens/NotificationsConfirmation/Email';

const AppRoutes = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <Sidebar>
              <RequireAuth />
            </Sidebar>
          }
        >
          <Route path="/account" element={<AccountDetails />} />

          <Route path="/maintenances" element={<MaintenancesList />} />

          <Route path="/buildings" element={<Outlet />}>
            <Route index element={<BuildingsList />} />
            <Route path="details/:buildingName" element={<BuildingDetails />} />
            <Route path="details/:buildingName/maintenances/add" element={<AddMaintenances />} />
          </Route>
        </Route>

        <Route path="/confirm/phone" element={<PhoneConfirm />} />
        <Route path="/confirm/email" element={<EmailConfirm />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoutes;
