import { Navigate, Route, Routes, Outlet } from 'react-router-dom';;
import BaoCaoLaoDongsPage from './tonghopbaocaos/baocaolaodongs/BaoCaoLaoDongsPage';

const TongHopBaoCaoPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path='baocaolaodongs' element={<BaoCaoLaoDongsPage />} />
        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route index element={<Navigate to="/baocao/tonghopbaocaos/baocaolaodongs" />} />
      </Route>
    </Routes>
  );
};

export default TongHopBaoCaoPage;
