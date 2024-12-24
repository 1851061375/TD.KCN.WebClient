/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { RootState } from '@/redux/RootReducer';
import { TableProps } from 'antd/es/table';
import { Popconfirm, Checkbox } from 'antd';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/redux/Store';
import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { requestPOST, requestDELETE } from '@/utils/baseAPI';
import { IDonViTinhDto, IPaginationResponse, IResult } from '@/models';

import { TDTable } from '@/app/components';
import { SearchData } from '@/types';

import ModalItem from './ChiTietModal';

interface LoaiBaoCaosTableProps {
  searchData?: SearchData;
}

const DataTable: React.FC<LoaiBaoCaosTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const random = useSelector((state: RootState) => state.global.random);

  const [dataTable, setDataTable] = useState<IDonViTinhDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IDonViTinhDto[]>>('api/v1/donvitinhs/search', {
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
      console.error('Error fetching data: ', error);
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

  const handleAction = useCallback(
    async (type: string, record: IDonViTinhDto): Promise<void> => {
      try {
        switch (type) {
          case 'chi-tiet':
            dispatch(actionsModal.setDataModal(record));
            dispatch(actionsModal.setModalVisible(true));
            break;
          case 'delete':
            // eslint-disable-next-line no-case-declarations
            const response = await requestDELETE<IResult<boolean>>(`api/v1/donvitinhs/${record.id}`);
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

  const columns: TableProps<IDonViTinhDto>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'text-center',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: 'Tên ',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      className: 'text-center',
      key: 'ma',
    },
    {
      title: 'Sử dụng',
      dataIndex: 'suDung',
      key: 'suDung',
      className: 'text-center',
      render: (text, record) => {
        return <Checkbox checked={record.suDung ? true : false} disabled />;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'moTa',
      key: 'moTa',
      render: (text, record) => {
        return text;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      key: '',
      className: 'text-center',
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
          <TDTable<IDonViTinhDto>
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

export default DataTable;
