import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import AuditsPage from '@/app/pages/admin/audits/AuditsPage';
import LoginLogsPage from '@/app/pages/admin/loginlogs/LoginLogsPage';
import OrganizationUnitsPage from '@/app/pages/admin/organizationunits/OrganizationUnitsPage';
import UsersPage from '@/app/pages/admin/users/UsersPage';
import PositionsPage from '@/app/pages/admin/positions/PositionsPage';

const SystemsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="audits" element={<AuditsPage />} />
        <Route path="loginlogs" element={<LoginLogsPage />} />
        <Route path="organizationunits" element={<OrganizationUnitsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route index element={<Navigate to="/admin/systems/audits" />} />
      </Route>
    </Routes>
  );
};

export default SystemsPage;
