import { lazy, FC, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { MasterLayout } from '../../_metronic/layout/MasterLayout';
import { DashboardLayout } from '../../_metronic/layout/DashboardLayout';

import TopBarProgress from 'react-topbar-progress-indicator';
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils';
import { WithChildren } from '../../_metronic/helpers';
import { SidebarMenuBaoCao, SidebarMenuMain, SidebarMenuSystem } from '@/_metronic/layout/components/sidebar';
import { MenuInnerMain } from '@/_metronic/layout/components/header/header-menus';

const PrivateRoutes = () => {
  const DashboardRoutes = lazy(() => import('./DashboardRoutes'));
  const AdminRoutes = lazy(() => import('./admin/AdminRoutes'));
  const BaoCaoRoutes = lazy(() => import('./baocao/BaoCaoRoutes'));
  const UserprofileRoutes = lazy(() => import('./UserprofileRoutes'));

  return (
    <Routes>
      <Route path="auth/*" element={<Navigate to={`/dashboard`} />} />

      <Route path="dashboard/*" element={<MasterLayout asideMenu={<SidebarMenuMain />} menuInner={<MenuInnerMain />} />}>
        <Route
          path="*"
          element={
            <SuspensedView>
              <DashboardRoutes />
            </SuspensedView>
          }
        />
      </Route>

      <Route path="baocao/*" element={<MasterLayout asideMenu={<SidebarMenuBaoCao />} menuInner={<MenuInnerMain />} />}>
        <Route
          path="*"
          element={
            <SuspensedView>
              <BaoCaoRoutes />
            </SuspensedView>
          }
        />
      </Route>

      <Route path="admin/*" element={<MasterLayout asideMenu={<SidebarMenuSystem />} menuInner={<MenuInnerMain />} />}>
        <Route
          path="*"
          element={
            <SuspensedView>
              <AdminRoutes />
            </SuspensedView>
          }
        />
      </Route>
      {/* <Route path="userprofile/*" element={<DashboardLayout menuInner={<MenuInnerMain />} />}>
        <Route
          path="*"
          element={
            <SuspensedView>
              <UserprofileRoutes />
            </SuspensedView>
          }
        />
      </Route> */}
      {/* Page Not Found */}
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--bs-primary');
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
