/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { TableProps } from 'antd/es/table';

import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { requestPOST, requestDELETE } from '@/utils/baseAPI';
import ModalItem from './ChiTietModal';
import { RootState } from '@/redux/RootReducer';
import { AppDispatch } from '@/redux/Store';
import { SearchData } from '@/types';
import { IPosition, IPaginationResponse, IResult } from '@/models';
import { TDTable } from '@/app/components';

interface PositionsTableProps {
  searchData?: SearchData;
}

const PositionsTable: React.FC<PositionsTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const random = useSelector((state: RootState) => state.global.random);

  const [dataTable, setDataTable] = useState<IPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchAuditData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IPosition[]>>('api/v1/positions/search', {
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
      fetchAuditData();
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    if (!isRefreshing) {
      setIsRefreshing(true);
    }
  }, [currentPage, pageSize, searchData, random]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchData]);

  const handleAction = async (type: string, record: IPosition): Promise<void> => {
    try {
      switch (type) {
        case 'chi-tiet':
          dispatch(actionsModal.setDataModal(record));
          dispatch(actionsModal.setModalVisible(true));
          break;
        case 'delete':
          // eslint-disable-next-line no-case-declarations
          const response = await requestDELETE<IResult<boolean>>(`api/v1/positions/${record.id}`);
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

  const columns: TableProps<IPosition>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã chức vụ',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (text, record) => <div>{record.createdOn ? dayjs(record.createdOn).format('DD/MM/YYYY HH:mm') : ''}</div>,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
      render: (text, record) => {
        return (
          <div className={`badge badge-light-${record?.isActive ? 'success' : 'danger'}`}>
            {record?.isActive ? 'Đang hoạt động' : 'Dừng hoạt động'}
          </div>
        );
      },
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
              title="Xem chi tiết"
              onClick={() => {
                handleAction(`chi-tiet`, record);
              }}
            >
              <i className="fa fa-eye"></i>
            </a>

            <Popconfirm
              title="Xoá?"
              onConfirm={() => {
                handleAction(`delete`, record);
              }}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <a className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1" data-toggle="m-tooltip" title="Xoá">
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
      <div className="card-body card-dashboard px-3 py-3">
        <div className="card-dashboard-body table-responsive">
          <TDTable<IPosition>
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
      {modalVisible ? <ModalItem /> : <></>}
    </>
  );
};

export default PositionsTable;
