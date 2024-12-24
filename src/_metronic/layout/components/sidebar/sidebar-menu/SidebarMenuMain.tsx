import React from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItemWithSub';
import { SidebarMenuItem } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem';
import { useAuth } from '@/app/modules/auth';

export const SidebarMenuMain = () => {
  const intl = useIntl();

  return (
    <>
      <SidebarMenuItem to="/dashboard" title="Trang chủ" icon="category" />

    </>
  );
};
