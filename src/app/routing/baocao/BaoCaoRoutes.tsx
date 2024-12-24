import CauHinhBaoCaoPage from '@/app/pages/baocao/CauHinhBaoCaoPage';
import DanhMucBaoCaoPage from '@/app/pages/baocao/DanhMucBaoCaoPage';
import DashboardWrapper from '@/app/pages/baocao/dashboards/DashboardWrapper';
import DuyetBaoCaosPage from '@/app/pages/baocao/duyetbaocaos/DuyetBaoCaosPage';
import TongHopBaoCaoPage from '@/app/pages/baocao/TongHopBaoCaoPage';
import { Route, Routes, Outlet } from 'react-router-dom';


const BaoCaoRoutes = () => {
  return (
    <Routes>

      <Route element={<Outlet />}>
        <Route
          path="__dashboard"
          element={<DashboardWrapper />}
        />
        <Route
          path="danhmucbaocaos/*"
          element={<DanhMucBaoCaoPage />}
        />
        <Route
          path="cauhinhbaocaos/*"
          element={<CauHinhBaoCaoPage />}
        />
        <Route
          path="duyetbaocaos"
          element={<DuyetBaoCaosPage />}
        />
        <Route
          path="tonghopbaocaos/*"
          element={<TongHopBaoCaoPage />}
        />
      </Route>
    </Routes>
  );
};

export default BaoCaoRoutes;
