import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import { DashboardWrapper } from '@/app/pages/dashboard/DashboardWrapper';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index element={<DashboardWrapper />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
