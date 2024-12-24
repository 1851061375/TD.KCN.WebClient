import React from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItemWithSub';
import { SidebarMenuItem } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem';
import { useAuth } from '@/app/modules/auth';

export const SidebarMenuBaoCao = () => {
  const intl = useIntl();

  return (
    <>
      <SidebarMenuItem to="/baocao/__dashboard" title="Dashboard" icon="category" />
      <SidebarMenuItemWithSub to="/danhmucbaocaos" title="Danh mục báo cáo" icon="folder">
        <SidebarMenuItem to="/baocao/danhmucbaocaos/donvitinhs" title="Đơn vị tính" hasBullet={true} />
        <SidebarMenuItem to="/baocao/danhmucbaocaos/loaibaocaos" title="Loại báo cáo" hasBullet={true} />
        <SidebarMenuItem to="/baocao/danhmucbaocaos/loaikydulieus" title="Loại kỳ dữ liệu" hasBullet={true} />
        <SidebarMenuItem to="/baocao/danhmucbaocaos/loaitonghops" title="Loại tổng hợp" hasBullet={true} />
        <SidebarMenuItem to="/baocao/danhmucbaocaos/kybaocaos" title="Kỳ báo cáo" hasBullet={true} />
        <SidebarMenuItem to="/baocao/danhmucbaocaos/sokybaocaos" title="Số kỳ báo cáo" hasBullet={true} />
        <SidebarMenuItem to="/baocao/danhmucbaocaos/nhacviecbaocaos" title="Nhắc việc báo cáo" hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub to="/cauhinhbaocaos" title="Cấu hình báo cáo" icon="setting-2">
        <SidebarMenuItem to="/baocao/cauhinhbaocaos/chitieubaocaos" title="Chỉ tiêu báo cáo" hasBullet={true} />
        <SidebarMenuItem to="/baocao/cauhinhbaocaos/bieumaubaocaos" title="Biểu mẫu báo cáo" hasBullet={true} />
        <SidebarMenuItem to="/baocao/cauhinhbaocaos/kyhannopbaocaos" title="Kỳ hạn nộp báo cáo" hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem to="/baocao/duyetbaocaos" title="Duyệt báo cáo" icon="abstract-18" />
      <SidebarMenuItemWithSub to="/tonghopbaocaos" title="Tổng hợp báo cáo" icon="graph-up">
        <SidebarMenuItem to="/baocao/tonghopbaocaos/baocaolaodongs" title="Tổng hợp báo cáo lao động" hasBullet={true} />
        {/* <SidebarMenuItem to="/baocao/tonghopbaocaos/baocaodautus" title="Tổng hợp báo cáo đầu tư" hasBullet={true} /> */}
        {/* <SidebarMenuItem to="/baocao/tonghopbaocaos/baocaodoanhnghieps" title="Tổng hợp báo cáo doanh nghiệp" hasBullet={true} /> */}
        {/* <SidebarMenuItem to="/baocao/tonghopbaocaos/baocaotnmts" title="Tổng hợp báo cáo tài nguyên, môi trường" hasBullet={true} />
        <SidebarMenuItem to="/baocao/tonghopbaocaos/baocaopcccs" title="Tổng hợp báo cáo PCCC và ANTT" hasBullet={true} /> */}
      </SidebarMenuItemWithSub>
    </>
  );
};
