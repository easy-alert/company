// LIBS
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// CONTEXTS
import { AuthProvider } from '@contexts/Auth/AuthProvider';
import { RequireAuth } from '@contexts/Auth/RequireAuth';

// COMPONENTS
import { Sidebar } from '@components/Sidebar';

// AUTHENTICATION
import { Login } from '@screens/Authentication/Login';
import { Register } from '@screens/Authentication/Register';
import Forbidden from '@screens/Forbidden';

// NOTIFICATIONS CONFIRMATION
import { PhoneConfirm } from '@screens/NotificationsConfirmation/Phone';
import { EmailConfirm } from '@screens/NotificationsConfirmation/Email';

// TERMS OF USE
import { TermsOfUse } from '@screens/TermsOfUse';

// HOME PAGE
import HomePage from '@screens/Home';

// DASHBOARD PAGES
import { Dashboard } from '@screens/Dashboard';

// CALENDAR PAGES
import { MaintenancesCalendar } from '@screens/Calendar';

// BUILDINGS PAGES
import { BuildingsList } from '@screens/Buildings/List';
import { BuildingDetails } from '@screens/Buildings/Details';
import { BuildingManageMaintenances } from '@screens/Buildings/BuildingManageMaintenances';
import { BuildingMaintenancesList } from '@screens/Buildings/BuildingMaintenancesList';
import { MaintenancesList } from '@screens/Maintenances/List';

// CHECKLISTS PAGES
import { Checklists } from '@screens/Checklists';

// TICKETS PAGES
import TicketsPage from '@screens/Tickets';

// REPORTS PAGES
import { MaintenanceReports } from '@screens/Reports/Maintenances';
import { ChecklistReports } from '@screens/Reports/Checklists';
import { TicketReports } from '@screens/Reports/Tickets';

// SUPPLIERS PAGES
import { SupplierDetails } from '@screens/Suppliers/Details';
import { SuppliersList } from '@screens/Suppliers/List';

// TUTORIALS PAGES
import { Tutorials } from '@screens/Tutorials';

// ACCOUNT PAGES
import { AccountDetails } from '@screens/Account/Details';
import UserPermissions from '@screens/Account/UserPermissions';

// RECOVER PASSWORD
import { SendPasswordRecoverEmail } from '@screens/Authentication/SendPasswordRecoverEmail';
import { RecoverPassword } from '@screens/Authentication/RecoverPassword';

// PERMISSION PROTECTED ROUTE
import PermissionRoute from './PermissionRoute';

const AppRoutes = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* base route */}
        <Route path="*" element={<Login />} />

        {/*  authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/passwordrecover/sendemail" element={<SendPasswordRecoverEmail />} />
        <Route path="/passwordrecovery/change" element={<RecoverPassword />} />

        {/* notifications confirmations routes */}
        <Route path="/confirm/phone" element={<PhoneConfirm />} />
        <Route path="/confirm/email" element={<EmailConfirm />} />

        {/* terms of use  route */}
        <Route path="/terms" element={<TermsOfUse />} />

        {/* protected routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Sidebar />
            </RequireAuth>
          }
        >
          <Route path="/home" element={<HomePage />} />

          {/* dashboard route */}
          <Route
            path="/dashboard"
            element={<PermissionRoute requiredPermission="access:dashboard" />}
          >
            <Route index element={<Dashboard />} />
          </Route>

          {/* calendar route */}
          <Route
            path="/calendar"
            element={<PermissionRoute requiredPermission="access:calendar" />}
          >
            <Route index element={<MaintenancesCalendar />} />
          </Route>

          {/* buildings route */}
          <Route
            path="/buildings"
            element={<PermissionRoute requiredPermission="access:buildings" />}
          >
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

          {/* checklists route */}
          {/* <Route
            path="/checklists"
            element={<PermissionRoute requiredPermission="access:checklist" />}
          >
            <Route index element={<Checklists />} />
          </Route> */}

          {/* tickets route */}
          <Route path="/tickets" element={<PermissionRoute requiredPermission="access:tickets" />}>
            <Route index element={<TicketsPage />} />
          </Route>

          {/* reports route */}
          <Route path="/reports" element={<PermissionRoute requiredPermission="access:reports" />}>
            <Route path="maintenances" element={<MaintenanceReports />} />
            <Route path="checklists" element={<ChecklistReports />} />
            <Route path="tickets" element={<TicketReports />} />
          </Route>

          {/* suppliers route */}
          <Route
            path="/suppliers"
            element={<PermissionRoute requiredPermission="access:suppliers" />}
          >
            <Route index element={<SuppliersList />} />
            <Route path=":supplierId" element={<SupplierDetails />} />
          </Route>

          {/* tutorials route */}
          <Route
            path="/tutorials"
            element={<PermissionRoute requiredPermission="access:tutorials" />}
          >
            <Route index element={<Tutorials />} />
          </Route>

          {/* account route */}
          <Route path="/account" element={<PermissionRoute requiredPermission="access:account" />}>
            <Route index element={<AccountDetails />} />
            <Route path=":userId/permissions" element={<UserPermissions />} />
          </Route>

          <Route path="/maintenances" element={<MaintenancesList />} />

          <Route path="/forbidden" element={<Forbidden />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default AppRoutes;
