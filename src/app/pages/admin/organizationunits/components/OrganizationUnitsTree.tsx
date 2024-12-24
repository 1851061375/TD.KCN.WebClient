/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { MenuProps, Modal, Table } from 'antd';
import { toast } from 'react-toastify';

import { Tree } from 'antd';
import { Dropdown, Menu } from 'antd';
import { DataNode } from 'antd/es/tree';
import { AppDispatch } from '@/redux/Store';
import { RootState } from '@/redux/RootReducer';
import { requestDELETE, requestPOST } from '@/utils/baseAPI';
import { IPaginationResponse, IResult } from '@/models';
import { IOrganizationUnitDetails } from '@/models';

import * as actionsOrganizationUnit from '@/redux/organization-unit/Actions';
import * as actionsGlobal from '@/redux/global/Actions';

interface TreeNode extends DataNode {
  id: string | number;
  name: string;
  children?: TreeNode[];
}

const OrganizationUnitsTree = () => {
  const dispatch: AppDispatch = useDispatch();
  const random = useSelector((state: RootState) => state.global.random);

  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const handleDeleteGroup = useCallback(async (idDelete: string | number): Promise<void> => {
    Modal.confirm({
      title: 'Xoá nhóm',
      content: 'Bạn có chắc chắn muốn xoá nhóm này?',
      okText: 'Đồng ý',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          const response = await requestDELETE<IResult<string>>(`api/v1/organizationunits/${idDelete}`);
          if (response.data?.succeeded) {
            toast.success('Xóa nhóm thành công!');
            dispatch(actionsOrganizationUnit.resetData());
            dispatch(actionsGlobal.setRandom());
          } else {
            toast.error(response?.data?.exception || 'Xóa nhóm thất bại!');
          }
        } catch (error) {
          console.error('Delete group error:', error);
          toast.error('Có lỗi xảy ra khi xóa nhóm!');
        }
      },
    });
  }, []);

  const buildTreeData = useCallback((items: IOrganizationUnitDetails[], parentId: string | number | null = null): TreeNode[] => {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => {
        const menuItems: MenuProps['items'] = [
          { label: 'Thêm đơn vị con', key: 'createChild' },
          { label: 'Sửa đơn vị', key: 'edit' },
          { label: 'Xoá đơn vị', key: 'delete' },
        ];

        const handleMenuClick = ({ key }: { key: string }) => {
          switch (key) {
            case 'edit':
              dispatch(actionsOrganizationUnit.setModalVisible({ modalVisible: true, type: 'edit', modalData: item }));
              break;
            case 'createChild':
              dispatch(actionsOrganizationUnit.setModalVisible({ modalVisible: true, type: 'createChild', modalData: item }));
              break;
            case 'delete':
              handleDeleteGroup(item.id);
              break;
          }
        };

        return {
          ...item,
          id: item.id || Math.random().toString(32),
          name: item.name || '',
          key: item.id || Math.random().toString(32),
          title: (
            <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['contextMenu']}>
              <div className="site-dropdown-context-menu">{item.name}</div>
            </Dropdown>
          ),
          children: buildTreeData(items, item.id),
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrganizationUnits = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IOrganizationUnitDetails[]>>('api/v1/organizationunits/search', {
        advancedSearch: {
          fields: ['name', 'code'],
          keyword: null,
        },
        allowParentCodeNull: null,
        allowParentIdNull: null,
        pageNumber: 1,
        pageSize: 100000,
        orderBy: ['name'],
      });

      if (response?.data?.data) {
        const treeNodes = buildTreeData(response.data.data);
        setTreeData(treeNodes);
      }
    } catch (error) {
      console.error('Fetch organization units error:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  }, [buildTreeData]);

  useEffect(() => {
    fetchOrganizationUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [random]);

  const handleSelect = (selectedKeys: React.Key[], info: any): void => {
    if (info?.selected) {
      dispatch(actionsOrganizationUnit.setSelectedOrganizationUnit(info?.node));
    } else {
      dispatch(actionsOrganizationUnit.setSelectedOrganizationUnit(null));
    }
  };

  return (
    <>
      <div className="card-body card-dashboard px-3 py-3">
        <div className="card-dashboard-body">
          {/* <Table dataSource={dataTable} columns={columns} loading={loading} rowKey={Math.random().toString(32)} /> */}
          <Tree onSelect={handleSelect} treeData={treeData} showLine={{ showLeafIcon: false }} blockNode />
        </div>
      </div>
    </>
  );
};

export default OrganizationUnitsTree;
