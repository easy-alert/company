import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
// COMPONENTS
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { RequireAuth } from './contexts/Auth/RequireAuth';
import { Sidebar } from './components/Sidebar';

// AUTHENTICATION
import { Login } from './screens/Authentication/Login';
import { Register } from './screens/Authentication/Register';

// ACCOUNT
import { AccountDetails } from './screens/Account/Details';

// MAINTENANCES
import { MaintenancesList } from './screens/Maintenances/List';

// BUILDINGS
import { BuildingsList } from './screens/Buildings/List';
import { BuildingDetails } from './screens/Buildings/Details';
import { BuildingManageMaintenances } from './screens/Buildings/BuildingManageMaintenances';
import { BuildingMaintenancesList } from './screens/Buildings/BuildingMaintenancesList';

// NOTIFICATIONS CONFIRMATION
import { PhoneConfirm } from './screens/NotificationsConfirmation/Phone';
import { EmailConfirm } from './screens/NotificationsConfirmation/Email';

// CALENDAR
import { MaintenancesCalendar } from './screens/Calendar';

// REPORT
import { MaintenanceReports } from './screens/Reports/Maintenances';

// TERMS OF USE
import { TermsOfUse } from './screens/TermsOfUse';

// RECOVERPASSWORD
import { SendPasswordRecoverEmail } from './screens/Authentication/SendPasswordRecoverEmail';
import { RecoverPassword } from './screens/Authentication/RecoverPassword';

// TUTORIALS
import { Tutorials } from './screens/Tutorials';

// DASHBOARD
import { Dashboard } from './screens/Dashboard';
import { Checklists } from './screens/Checklists';
import { Tickets } from './screens/Tickets';
import { ChecklistReports } from './screens/Reports/Checklists';
import { TicketReports } from './screens/Reports/Tickets';

const AppRoutes = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/terms" element={<TermsOfUse />} />

        <Route path="/passwordrecover/sendemail" element={<SendPasswordRecoverEmail />} />

        <Route path="/passwordrecovery/change" element={<RecoverPassword />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Sidebar />
            </RequireAuth>
          }
        >
          <Route path="/account" element={<AccountDetails />} />

          <Route path="/tutorials" element={<Tutorials />} />

          <Route path="/maintenances" element={<MaintenancesList />} />

          <Route path="/buildings" element={<Outlet />}>
            <Route index element={<BuildingsList />} />

            <Route path="details/:buildingId" element={<BuildingDetails />} />

            <Route
              path="details/:buildingId/maintenances/manage"
              element={<BuildingManageMaintenances />}
            />

            <Route
              path="details/:buildingId/maintenances/list"
              element={<BuildingMaintenancesList />}
            />
          </Route>

          <Route path="/calendar" element={<MaintenancesCalendar />} />

          <Route path="reports/maintenances" element={<MaintenanceReports />} />
          <Route path="reports/checklists" element={<ChecklistReports />} />
          <Route path="reports/tickets" element={<TicketReports />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/checklists" element={<Checklists />} />

          <Route path="/tickets" element={<Tickets />} />
        </Route>

        <Route path="/confirm/phone" element={<PhoneConfirm />} />
        <Route path="/confirm/email" element={<EmailConfirm />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoutes;
