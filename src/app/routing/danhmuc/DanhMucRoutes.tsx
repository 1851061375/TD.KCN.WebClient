import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import { DashboardWrapper } from '@/app/pages/dashboard/DashboardWrapper';
import DanhMucChungPage from './DanhMucChungPage';


const DanhMucRoutes = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>

        <Route element={<Outlet />}>
          <Route
            path="dmchung/*"
            element={
              <>
                <DanhMucChungPage />
              </>
            }
          />

        </Route>


        <Route path="*" element={<Navigate to="/error/404/system" />} />

        <Route index element={<Navigate to="/danh-muc/dmchung" />} />
      </Route>
    </Routes>
  );
};

export default DanhMucRoutes;
