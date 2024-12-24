/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { TableProps } from 'antd/es/table';

import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { requestPOST, requestDELETE } from '@/utils/baseAPI';
import { RootState } from '@/redux/RootReducer';
import { AppDispatch } from '@/redux/Store';
import { SearchData } from '@/types';
import { IPaginationResponse, IResult, IUserDto } from '@/models';
import { TDTable } from '@/app/components';
import { useAuth } from '@/app/modules/auth';
import { CheckRole } from '@/utils/utils';

import UserDetailsModal from './UserDetailsModal';
import ResetPasswordModal from './ResetPasswordModal';
import PermissionModal from './PermissionModal';

interface UsersTableProps {
  searchData?: SearchData;
}

const UsersTable: React.FC<UsersTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const { currentUser } = useAuth();
  const currentPermissions = currentUser?.permissions;

  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const random = useSelector((state: RootState) => state.global.random);

  const [dataTable, setDataTable] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [permissionModalVisible, setPermissionModalVisible] = useState<boolean>(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState<boolean>(false);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IUserDto[]>>('api/v1/users/search', {
        pageNumber: currentPage,
        pageSize,
        ...searchData,
      });

      if (response.data) {
        const { data, totalCount } = response.data;
        setDataTable(data ?? []);
        setTotalCount(totalCount);
      } else {
        setDataTable([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching audit data:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      setDataTable([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRefreshing) {
      fetchData();
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshing]);

  useEffect(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchData, random]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchData]);

  const handleDelete = async (record: IUserDto): Promise<void> => {
    const response = await requestDELETE<IResult<boolean>>(`api/users/${record.id}`);
    if (response?.data?.succeeded) {
      toast.success('Xóa thành công!');
      dispatch(actionsGlobal.setRandom());
    } else {
      toast.error(response?.data?.message || 'Xóa thất bại, vui lòng thử lại!');
    }
  };

  const handleAction = async (type: string, record: IUserDto): Promise<void> => {
    try {
      switch (type) {
        case 'edit-user':
          dispatch(actionsModal.setDataModal(record));
          dispatch(actionsModal.setModalVisible(true));
          break;
        case 'reset-password':
          dispatch(actionsModal.setDataModal(record));
          setResetPasswordModalVisible(true);
          break;
        case 'set-permission':
          dispatch(actionsModal.setDataModal(record));
          setPermissionModalVisible(true);
          break;

        case 'toggle-status':
          await requestPOST(`api/users/${record.id}/toggle-status`, {
            activateUser: !record.isActive,
            userId: record.id,
          });

          toast.success('Thao tác thành công!');
          dispatch(actionsGlobal.setRandom());

          break;

        case 'delete':
          handleDelete(record);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const columns: TableProps<IUserDto>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdOn',
      key: 'createdOn',
    },

    {
      width: '10%',
      title: 'Trạng thái',
      render: (text, record, index) => {
        return (
          <>
            <div className={clsx('badge fw-bolder', `badge-light-${record.isActive ? 'success' : 'danger'}`)}>
              {record.isActive ? 'Đang hoạt động' : 'Chưa kích hoạt'}
            </div>
          </>
        );
      },
      key: 'isActive',
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      key: '',
      width: 170,
      render: (text, record) => {
        return (
          <div>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Sửa thông tin"
              onClick={() => {
                handleAction(`edit-user`, record);
              }}
            >
              <i className="fa fa-user-pen" />
            </a>

            {CheckRole(currentPermissions, ['Permissions.Users.Delete']) && (
              <Popconfirm
                title="Xoá?"
                onConfirm={() => {
                  handleAction(`delete`, record);
                }}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <a className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1" data-toggle="m-tooltip" title="Xoá">
                  <i className="fa fa-trash" />
                </a>
              </Popconfirm>
            )}
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'reset-password',
                    disabled: false,
                    label: (
                      <a
                        className="e-1 p-2 text-dark"
                        onClick={() => {
                          handleAction(`reset-password`, record);
                        }}
                      >
                        <i className={`fa fa-key me-2`} />
                        {`Khôi phục mật khẩu`}
                      </a>
                    ),
                  },
                  {
                    key: 'verifi-user',
                    disabled: false,
                    label: (
                      <a
                        className="e-1 p-2 text-dark"
                        onClick={() => {
                          handleAction(`toggle-status`, record);
                        }}
                      >
                        <i className={clsx(`fa me-2`, record?.isActive ? 'fa-user-lock ' : 'fa-lock-open')} />
                        {record?.isActive ? 'Dừng kích hoạt tài khoản' : 'Kích hoạt tài khoản'}
                      </a>
                    ),
                  },
                  CheckRole(currentPermissions, ['Permissions.Permissions.Manage'])
                    ? {
                      key: 'set-permission',
                      disabled: false,
                      label: (
                        <a
                          className="e-1 p-2 text-dark"
                          onClick={() => {
                            handleAction(`set-permission`, record);
                          }}
                        >
                          <i className={`fa fa-user-shield me-2`} />
                          Cấp quyền
                        </a>
                      ),
                    }
                    : null,
                ],
              }}
            >
              <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1" title="Thao tác nhanh">
                <i className="fa fa-ellipsis-h" />
              </a>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="card-body card-dashboard px-3 py-3">
        <div className="card-dashboard-body table-responsive">
          <TDTable<IUserDto>
            dataSource={dataTable}
            columns={columns}
            isPagination={true}
            pageSize={pageSize}
            count={totalCount}
            offset={currentPage}
            setOffset={setCurrentPage}
            setPageSize={setPageSize}
            loading={loading}
          />
        </div>
      </div>
      {modalVisible ? <UserDetailsModal /> : <></>}
      {permissionModalVisible ? <PermissionModal visible={permissionModalVisible} setVisible={setPermissionModalVisible} /> : <></>}
      {resetPasswordModalVisible ? <ResetPasswordModal visible={resetPasswordModalVisible} setVisible={setResetPasswordModalVisible} /> : <></>}
    </>
  );
};

export default UsersTable;
