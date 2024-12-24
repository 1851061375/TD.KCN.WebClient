import { useIntl } from 'react-intl';
import { MenuItem } from '@/_metronic/layout/components/header/header-menus/MenuItem';
import { MenuInnerWithSub } from '@/_metronic/layout/components/header/header-menus/MenuInnerWithSub';
import { useAuth } from '@/app/modules/auth';

export const MenuInnerMain = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const permissions = currentUser?.permissions;

  return (
    <>
      <MenuItem title="Trang chủ" to="/dashboard" icon="category" />
      <MenuInnerWithSub
        title='Báo cáo'
        to='/baocao'
        hasArrow={true}
        menuPlacement='bottom-start'
        menuTrigger={`{default:'click', lg: 'hover'}`}
        icon="calendar"
      >
        <MenuItem to='/baocao/__dashboard' title='Dashboard' icon="category" classNameMenuItem="px-2" />
        <MenuItem to='/baocao/danhmucbaocaos' title='Danh mục báo cáo' icon="folder" classNameMenuItem="px-2" />
        <MenuItem to='/baocao/cauhinhbaocaos' title='Cấu hình báo cáo' icon="setting-2" classNameMenuItem="px-2" />
        <MenuItem to='/baocao/duyetbaocaos' title='Duyệt báo cáo' icon="abstract-18" classNameMenuItem="px-2" />
        <MenuItem to='/baocao/tonghopbaocaos' title='Tổng hợp báo cáo' icon="graph-up" classNameMenuItem="px-2" />
      </MenuInnerWithSub>
    </>
  );
}
