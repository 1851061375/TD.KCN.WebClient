import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import ChiTieuBaoCaosPage from './chitieubaocaos/ChiTieuBaoCaosPage';
import BieuMauBaoCaosPage from './bieumaubaocaos/BieuMauBaoCaosPage';
import { KyHanNopBaoCaosPage } from './kyhannopbaocaos/KyHanNopBaoCaosPage';

const CauHinhBaoCaoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path='chitieubaocaos' element={<ChiTieuBaoCaosPage />} />
        <Route path='bieumaubaocaos' element={<BieuMauBaoCaosPage />} />
        <Route path='kyhannopbaocaos' element={<KyHanNopBaoCaosPage />} />
        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route index element={<Navigate to="/baocao/cauhinhbaocaos/chitieubaocaos" />} />
      </Route>
    </Routes>
  );
};

export default CauHinhBaoCaoPage;
