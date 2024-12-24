import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import AuditsPage from '@/app/pages/admin/audits/AuditsPage';
import LoginLogsPage from '@/app/pages/admin/loginlogs/LoginLogsPage';
import OrganizationUnitsPage from '@/app/pages/admin/organizationunits/OrganizationUnitsPage';
import UsersPage from '@/app/pages/admin/users/UsersPage';
import PositionsPage from '@/app/pages/admin/positions/PositionsPage';
import RolesPage from '@/app/pages/admin/HeThong/CoCauToChuc/RolesPage';
import LoaiCoCauToChucsPage from '@/app/pages/admin/HeThong/loaicocau/LoaiCoCauToChucsPage';
import UsersList from '@/app/pages/admin/HeThong/users/UsersPage';
import QuanTriVaiTroPage from '@/app/pages/admin/HeThong/QuanTriVaiTro/QuanTriVaiTroPage';
import ChucVusPage from '@/app/pages/admin/HeThong/chucvu/ChucVusPage';
import QuyensPage from '@/app/pages/admin/HeThong/Quyen/QuyensPage';
import HuongDanSuDungsPage from '@/app/pages/admin/HeThong/HuongDanSuDung/HuongDanSuDungPage';
import PhanQuyenNguoiDungPage from '@/app/pages/admin/HeThong/PhanQuyenNguoiDung/PhanQuyenNguoiDungPage';
import NhomDanhMucPage from '@/app/pages/admin/HeThong/danhmuc/NhomDanhMucPage';

const SystemsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="audits" element={<AuditsPage />} />
        <Route path="loginlogs" element={<LoginLogsPage />} />
        <Route path="organizationunits" element={<RolesPage />} />
        <Route path="loaicocautochuc" element={<LoaiCoCauToChucsPage />} />
        <Route path="users" element={<UsersList />} />
        <Route path="roles" element={<QuanTriVaiTroPage />} />
        <Route path="chucvus" element={<ChucVusPage />} />
        <Route path="permissions" element={<QuyensPage />} />
        <Route path="huongdansudung" element={<HuongDanSuDungsPage />} />
        <Route path="phanquyennguoidung" element={<PhanQuyenNguoiDungPage />} />
        <Route path="danhmuc" element={<NhomDanhMucPage />} />
        {/* <Route path="organizationunits" element={<OrganizationUnitsPage />} /> */}
        {/* <Route path="users" element={<UsersPage />} /> */}
        {/* <Route path="positions" element={<PositionsPage />} /> */}
        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route index element={<Navigate to="/admin/systems/audits" />} />
      </Route>
    </Routes>
  );
};

export default SystemsPage;
