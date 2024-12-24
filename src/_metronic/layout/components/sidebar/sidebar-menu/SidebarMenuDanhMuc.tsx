import React from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItemWithSub';
import { SidebarMenuItem } from '@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem';
import { useAuth } from '@/app/modules/auth';

export const SidebarMenuDanhMuc = () => {
  const intl = useIntl();

  return (
    <>
      <SidebarMenuItemWithSub to="/danh-muc/dmchung" title="Danh mục chung" icon="abstract-14" fontIcon="bi-person">
        <SidebarMenuItem to="/danh-muc/dmchung/nhom-danh-muc" title="Nhóm danh mục" hasBullet={true} />
        <SidebarMenuItem to="/danh-muc/dmchung/_danh-muc" title="Danh mục" hasBullet={true} />
        <SidebarMenuItem to="/danh-muc/dmchung/danh-muc-tinh" title="Danh mục tỉnh" hasBullet={true} />
        <SidebarMenuItem to="/danh-muc/dmchung/danh-muc-huyen" title="Danh mục huyện" hasBullet={true} />
        <SidebarMenuItem to="/danh-muc/dmchung/danh-muc-xa" title="Danh mục xã" hasBullet={true} />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub to='/danh-muc/dmhslt' title='Hồ sơ lưu trữ' fontIcon='bi-sticky' icon='book'>
        <SidebarMenuItem to='/danh-muc/dmhslt/co-quan-luu-tru' title='Cơ quan lưu trữ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/phong-tai-lieu' title='Phông tài liệu' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/muc-luc-ho-so' title='Mục lục hồ sơ' hasBullet={true} />

        <SidebarMenuItem to='/danh-muc/dmhslt/linh-vuc' title='Lĩnh vực' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/loai-van-ban' title='Loại văn bản' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/thoi-han-bao-quan' title='Thời hạn bảo quản' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/ngon-ngu' title='Ngôn ngữ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/chuc-vu' title='Chức vụ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/ky-hieu-ho-so' title='Ký hiệu hồ sơ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/danh-muc-ho-so' title='Danh mục hồ sơ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/muc-do-truy-cap' title='Mức độ truy cập' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/tinh-trang-vat-ly' title='Tình trạng vật lý' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/quy-tac-ket-chuyen' title='Quy tắc kết chuyển' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/che-do-su-dung' title='Chế độ sử dụng' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/de-muc-ho-so-lon' title='Đề mục lớn' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/de-muc-ho-so-nho' title='Đề mục nhỏ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/nhom-phong' title='Nhóm phông' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/loai-ho-so' title='Loại hồ sơ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/loai-ke' title='Loại kệ' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/loai-ban' title='Loại bản' hasBullet={true} />
        <SidebarMenuItem to='/danh-muc/dmhslt/co-quan-ban-hanh' title='Cơ quan ban hành' hasBullet={true} />

      </SidebarMenuItemWithSub>

    </>
  );
};

