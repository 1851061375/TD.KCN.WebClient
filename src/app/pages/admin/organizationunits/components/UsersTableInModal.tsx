/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { TableProps } from 'antd/es/table';

import * as actionsGlobal from '@/redux/global/Actions';
import { requestPOST, requestDELETE } from '@/utils/baseAPI';
import { RootState } from '@/redux/RootReducer';
import { AppDispatch } from '@/redux/Store';
import { SearchData } from '@/types';
import { IPaginationResponse, IResult, IUserDto } from '@/models';
import { TDTable } from '@/app/components';

interface UsersTableInModalProps {
  searchData?: SearchData;
  selectedRowKeys: string[];
  setSelectedRowKeys: (selectedRowKeys: string[]) => void;
}

const UsersTableInModal: React.FC<UsersTableInModalProps> = ({ searchData, selectedRowKeys, setSelectedRowKeys }) => {
  const dispatch: AppDispatch = useDispatch();
  const currentOrganizationUnit = useSelector((state: RootState) => state.organizationUnit.selectedOrganizationUnit);
  const random = useSelector((state: RootState) => state.global.random);

  const [dataTable, setDataTable] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IUserDto[]>>('api/v1/users/search', {
        pageNumber: currentPage,
        pageSize,
        notInOrganizationUnitIds: currentOrganizationUnit?.id ? [currentOrganizationUnit?.id] : null,
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
            rowSelection={rowSelection}
          />
        </div>
      </div>
    </>
  );
};

export default UsersTableInModal;
