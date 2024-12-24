import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

import NhomDanhMucPage from '@/app/pages/danhmuc/nhomdanhmuc/NhomDanhMucPage';
import DanhMucPage from '@/app/pages/danhmuc/dmchung/DanhMucPage';
import DanhMucTinhPage from '@/app/pages/danhmuc/tinh/DanhMucTinhPage';
import DanhMucHuyenPage from '@/app/pages/danhmuc/huyen/DanhMucHuyenPage';
import DanhMucXaPage from '@/app/pages/danhmuc/xa/DanhMucXaPage';
import VanBanChiDaoPage from '@/app/pages/danhmuc/vanbanchidao/VanBanChiDaoPage';

const DanhMucChungPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="nhom-danh-muc" element={<NhomDanhMucPage />} />
        <Route path="_danh-muc" element={<DanhMucPage />} />
        <Route path="danh-muc-tinh" element={<DanhMucTinhPage />} />
        <Route path="danh-muc-huyen" element={<DanhMucHuyenPage />} />
        <Route path="danh-muc-xa" element={<DanhMucXaPage />} />
        <Route path="van-ban-chi-dao" element={<VanBanChiDaoPage />} />
      </Route>
    </Routes>
  );
};

export default DanhMucChungPage;
