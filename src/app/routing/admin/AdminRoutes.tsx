import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import { DashboardWrapper } from '@/app/pages/dashboard/DashboardWrapper';
import SystemPage from './SystemPage';
import UserPage from './UserPage';
import CategoryPage from '../danhmuc/DanhMucChungPage';
// import NhiemVuPage from './NhiemVuPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        {/* <Route path="dashboard" element={<DashboardWrapper />} /> */}

        <Route element={<Outlet />}>
          <Route
            path="system/*"
            element={
              <>
                <SystemPage />
              </>
            }
          />
          <Route
            path="user/*"
            element={
              <>
                <UserPage />
              </>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/error/404/system" />} />

        <Route index element={<Navigate to="/admin/user/organizationunits" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
