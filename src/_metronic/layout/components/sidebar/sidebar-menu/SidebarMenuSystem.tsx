import React from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItemWithSub';
import { SidebarMenuItem } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem';
import { useAuth } from '@/app/modules/auth';

export const SidebarMenuSystem = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const permissions = currentUser?.permissions;

  return (
    <>
      {/* <SidebarMenuItem to="/dashboard" icon="element-11" title={intl.formatMessage({ id: 'MENU.DASHBOARD' })} fontIcon="bi-app-indicator" /> */}

      <SidebarMenuItemWithSub to="/admin/user" title="Người dùng" icon="setting-2" fontIcon="bi-person">
        <SidebarMenuItem to="/admin/user/organizationunits" title="Cơ cấu tổ chức" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/roles" title="Nhóm người dùng" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/phanquyennguoidung" title="Phân quyền người dùng" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/permissions" title="Quyền người dùng" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/danhmuc" title="Danh mục" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/loaicocautochuc" title="Loại cơ cấu tổ chức" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/users" title="Người sử dụng" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/chucvus" title="Chức vụ" hasBullet={true} />
        <SidebarMenuItem to="/admin/user/huongdansudung" title="Hướng dẫn sử dụng" hasBullet={true} />
        {/* <SidebarMenuItem to="/admin/user/groups" title="Nhóm người dùng" hasBullet={true} /> */}
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub to="/admin/system" title="Hệ thống" icon="setting-2" fontIcon="bi-person">
        <SidebarMenuItem to="/admin/system/audits" title="Nhật ký hoạt động" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/loginlogs" title="Nhật ký đăng nhập" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/mail-setting" title="Cấu hình mail server" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/mail-template" title="Cấu hình mẫu gửi mail" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/mail-template" title="Bảo mật nâng cao" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/connected-app" title="Kết nối ứng dụng" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/trash" title="Thùng rác" hasBullet={true} />
        <SidebarMenuItem to="/admin/system/settings" title="Cấu hình hệ thống" hasBullet={true} />
      </SidebarMenuItemWithSub>
      {/* <SidebarMenuItemWithSub to="/admin/nhiemvu-ctxl" title="Nhiệm vụ chủ trì xử lý" icon="setting-2" fontIcon="bi-person">
        <SidebarMenuItem to="/admin/nhiemvu-ctxl/chu-tri-xu-ly-dht" title="Nhiệm vụ chủ trì xử lý đã hoàn thành" hasBullet={true} />
      </SidebarMenuItemWithSub> */}
    </>
  );
};

