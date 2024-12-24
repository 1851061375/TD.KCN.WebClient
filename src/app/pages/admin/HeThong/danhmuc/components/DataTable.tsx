import React, { useState, useEffect, useCallback } from 'react';
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
import { IResult, INhomDanhMuc } from '@/models';
import { TDTable } from '@/app/components';
import { useDataTable } from './useDataTable';

interface DataTableProps {
  searchData?: SearchData;
}

const DataTable: React.FC<DataTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);

  const { data, loading, totalCount, currentPage, pageSize, setCurrentPage, setPageSize } = useDataTable({ searchData });

  const handleAction = useCallback(
    async (type: string, record: INhomDanhMuc): Promise<void> => {
      try {
        switch (type) {
          case 'chi-tiet':
            dispatch(actionsModal.setDataModal(record));
            dispatch(actionsModal.setModalVisible(true));
            break;
          case 'delete':
            // eslint-disable-next-line no-case-declarations
            const response = await requestDELETE<IResult<boolean>>(`api/v1/nhomdanhmucs/${record.id}`);
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
    },
    [dispatch]
  );

  const columns: TableProps<INhomDanhMuc>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Tên nhóm danh mục',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Mã nhóm danh mục',
      dataIndex: 'ma',
      key: 'ma',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'moTa',
      key: 'moTa',
    },
    /* {
      title: 'Thời gian tạo',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (text, record) => <div>{record.createdOn ? dayjs(record.createdOn).format('DD/MM/YYYY HH:mm') : ''}</div>,
    }, */
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
          <TDTable<INhomDanhMuc>
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
      </div>
      {modalVisible ? <ModalItem /> : <></>}
    </>
  );
};

export default DataTable;
