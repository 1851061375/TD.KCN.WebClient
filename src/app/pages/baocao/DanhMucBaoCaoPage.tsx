import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import LoaiBaoCaosPage from './loaibaocaos/LoaiBaoCaosPage';
import LoaiKyDuLieusPage from './loaikydulieus/LoaiKyDuLieusPage';
import DonViTinhsPage from './donvitinhs/DonViTinhsPage';
import KyBaoCaosPage from './kybaocaos/KyBaoCaosPage';
import SoKyBaoCaosPage from './sokybaocaos/SoKyBaoCaosPage';
import LoaiTongHopsPage from './loaitonghops/LoaiTongHopsPage';
import NhacViecBaoCaosPage from './nhacviecbaocaos/NhacViecBaoCaosPage';
import UsersPage from './_donvitinhs/UsersPage';

const DanhMucBaoCaoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path='_donvitinhs' element={< UsersPage />} />
        <Route path='donvitinhs' element={<DonViTinhsPage />} />
        <Route path='loaibaocaos' element={<LoaiBaoCaosPage />} />
        <Route path='loaikydulieus' element={<LoaiKyDuLieusPage />} />
        <Route path='loaitonghops' element={<LoaiTongHopsPage />} />
        <Route path='kybaocaos' element={<KyBaoCaosPage />} />
        <Route path='sokybaocaos' element={<SoKyBaoCaosPage />} />
        <Route path='nhacviecbaocaos' element={<NhacViecBaoCaosPage />} />
        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route index element={<Navigate to="/baocao/danhmucbaocaos/loaibaocaos" />} />
      </Route>
    </Routes>
  );
};

export default DanhMucBaoCaoPage;
