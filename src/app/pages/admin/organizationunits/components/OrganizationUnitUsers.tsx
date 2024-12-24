import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Popconfirm, TableProps } from 'antd';
import { toast } from 'react-toastify';

import { AppDispatch, RootState } from '@/redux/Store';
import { TDTable } from '@/app/components';
import { requestDELETE } from '@/utils/baseAPI';
import { IResult, IUserOrganizationPositionDto } from '@/models';

import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { useOrganizationUsers } from '@/hooks/useOrganizationUsers';

const OrganizationUnitUsers = () => {
  const dispatch: AppDispatch = useDispatch();

  const currentOrganizationUnit = useSelector((state: RootState) => state.organizationUnit.selectedOrganizationUnit);
  const random = useSelector((state: RootState) => state.global.random);

  const { data, totalCount, loading, currentPage, pageSize, searchKeyword, setCurrentPage, setPageSize, setSearchKeyword, refresh } =
    useOrganizationUsers({
      organizationUnitId: currentOrganizationUnit?.id ?? null,
    });

  useEffect(() => {
    if (random) {
      refresh();
    }
  }, [random, refresh]);

  const handleAction = async (type: string, record: IUserOrganizationPositionDto): Promise<void> => {
    try {
      switch (type) {
        case 'chi-tiet':
          dispatch(actionsModal.setDataModal(record));
          dispatch(actionsModal.setModalVisible(true));
          break;
        case 'delete':
          // eslint-disable-next-line no-case-declarations
          const response = await requestDELETE<IResult<boolean>>(`api/v1/audits/${record.id}`);
          if (response?.data?.succeeded) {
            toast.success('Xóa thành công!');
            dispatch(actionsGlobal.setRandom());
          } else {
            toast.error(response?.data?.message || 'Xóa thất bại, vui lòng thử lại!');
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const columns: TableProps<IUserOrganizationPositionDto>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'positionName',
      key: 'positionName',
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      key: '',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Xem chi tiết/Sửa"
              onClick={() => {
                handleAction(`chi-tiet`, record);
              }}
            >
              <i className="fa fa-eye"></i>
            </a>

            <Popconfirm
              title="Bạn có muốn xoá người dùng khỏi đơn vị này?"
              onConfirm={() => {
                handleAction(`delete`, record);
              }}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <a
                className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1"
                data-toggle="m-tooltip"
                title="Xoá người dùng khỏi đơn vị"
              >
                <i className="fa fa-trash"></i>
              </a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="d-flex flex-column">
        <Input
          placeholder="Tìm kiếm người dùng"
          className="mb-3"
          value={searchKeyword}
          onChange={e => {
            setSearchKeyword(e.target.value);
          }}
        />
        <TDTable<IUserOrganizationPositionDto>
          dataSource={data}
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
    </>
  );
};

export default OrganizationUnitUsers;
