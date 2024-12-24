import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { IDiaBan } from '@/models/DiaBan';

interface DataTableProps {
  searchData?: SearchData;
}

const DataTable: React.FC<DataTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch(); 
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);

  const { data,tinh, loading, totalCount, currentPage, pageSize, setCurrentPage, setPageSize } = useDataTable({ searchData });
  //console.log("tinh",tinh);
  const handleAction = useCallback(
    async (type: string, record: IDiaBan): Promise<void> => {
      try {
        switch (type) {
          case 'chi-tiet':
            dispatch(actionsModal.setDataModal(record));
            dispatch(actionsModal.setModalVisible(true));
            break;
          case 'delete':
            // eslint-disable-next-line no-case-declarations
            const response = await requestDELETE<IResult<boolean>>(`api/v1/diabans/${record.id}`);
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

  const columns: TableProps<IDiaBan>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma',
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Tỉnh/thành phố',
      dataIndex: 'maCha',
      key: 'maCha',
      render: (text, record) => {
        const tinhs = tinh.find(prov => prov.ma === record.maCha);
        return (
          <div>{tinhs ? tinhs.ten : 'Không xác định'}</div>
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
          <TDTable<IDiaBan>
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
