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
import { IResult } from '@/models';
import { TDTable } from '@/app/components';
import { useDataTable } from './useDataTable';
import { IHuongDanSuDung } from '@/models/HuongDanSuDung';

interface DataTableProps {
  searchData?: SearchData;
}

const DataTable: React.FC<DataTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);

  const { data, loading, totalCount, currentPage, pageSize, setCurrentPage, setPageSize } = useDataTable({ searchData });

  const handleAction = useCallback(
    async (type: string, record: IHuongDanSuDung): Promise<void> => {
      try {
        switch (type) {
          case 'chi-tiet':
            dispatch(actionsModal.setDataModal(record));
            dispatch(actionsModal.setModalVisible(true));
            break;
            case 'edit':
            dispatch(actionsModal.setDataModal({...record, mode:'edit'}));
            dispatch(actionsModal.setModalVisible(true));
            break;
          case 'delete':
            // eslint-disable-next-line no-case-declarations
            const response = await requestDELETE<IResult<boolean>>(`api/v1/huongdansudungs/${record.id}`);
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

  const columns: TableProps<IHuongDanSuDung>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '3%',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      width: '20%',
      key: 'ten',
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      width: '20%',
      key: 'ma',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: '20%',
      key: 'moTa',
    },   
    {
      title: <div style={{ textAlign: 'center' }}>Đính kèm</div>,
      dataIndex: 'dinhKem',
      key: 'dinhKem',
      width: '20%',
      render: (text: string) => {
        if (!text) return <div></div>; 
        const domain = "https://minioapi.hanhchinhcong.net";
        const files = text.split('##').map((filePath) => {
          const fileName = filePath.split('/').pop(); // Lấy tên file
          const fileExtension = fileName?.split('.').pop()?.toLowerCase(); // Lấy đuôi file
          const iconMap: { [key: string]: string } = {
            xlsx: 'fa-file-excel',
            xls: 'fa-file-excel',
            pdf: 'fa-file-pdf',
            doc: 'fa-file-word',
            docx: 'fa-file-word',
          };
          const iconClass = iconMap[fileExtension || ''] || 'fa-file'; 
          return (
            <div key={filePath} style={{ marginBottom: '5px' }}>
              <a
                href={`${domain}/${filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <i className={`fa ${iconClass}  me-2`}></i>
                {fileName}
              </a>
            </div>
          );
        });
        return <div>{files}</div>;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      key: '',
      width: '10%',
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
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Sửa"
              onClick={() => {
                handleAction(`edit`, record);
              }}
            >
              <i className="fa fa-edit"></i>
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
          <TDTable<IHuongDanSuDung>
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
