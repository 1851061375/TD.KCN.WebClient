import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import  UserprofilePage  from '@/app/pages/admin/HeThong/ProfileUsers/UserprofilePage';

const UserprofileRoutes = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        {/* <Route index element={<Navigate to="/dashboard" />} /> */}
        <Route index element={<UserprofilePage />} />
      </Route>
    </Routes>
  );
};

export default UserprofileRoutes;
