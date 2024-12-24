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
import { IPaginationResponse, IResult, IBaoCaoDto, TrangThaiBaoCaoEnum, TrangThaiDuyetBaoCaoEnum } from '@/models';

import { TDTable } from '@/app/components';
import { SearchData } from '@/types';

import ModalItem from './ChiTietModal';
import dayjs from 'dayjs';

interface LoaiBaoCaosTableProps {
  searchData?: SearchData;
}

const DataTable: React.FC<LoaiBaoCaosTableProps> = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const random = useSelector((state: RootState) => state.global.random);

  const [dataTable, setDataTable] = useState<IBaoCaoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IBaoCaoDto[]>>('api/v1/baocaodanops/search', {
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
    async (type: string, record: IBaoCaoDto): Promise<void> => {
      try {
        switch (type) {
          case 'chi-tiet':
            dispatch(actionsModal.setDataModal(record));
            dispatch(actionsModal.setModalVisible(true));
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

  const columns: TableProps<IBaoCaoDto>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'text-center',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: "Tên báo cáo",
      dataIndex: "bieuMauBaoCaoTen",
      key: "bieuMauBaoCaoTen",
    },
    {
      title: "Đơn vị báo cáo",
      dataIndex: "organizationUnitName",
      key: "organizationUnitName",
      className: "text-center",
    },
    {
      title: "Kỳ báo cáo",
      dataIndex: "soKyBaoCaoTen",
      key: "soKyBaoCaoTen",
      className: "text-center",
    },
    {
      title: "Năm",
      dataIndex: "namBaoCao",
      key: "namBaoCao",
      className: "text-center",
    },
    {
      title: "Thời hạn nộp",
      dataIndex: "ngayBatDau",
      key: "ngayBatDau",
      render: (data, record) => (
        <div>
          {dayjs(data).format("DD/MM")} -{" "}
          {dayjs(record.hanNop).format("DD/MM/YYYY")}
        </div>
      ),
      className: "text-center",
    }, {
      title: "Ngày nộp",
      dataIndex: "ngayNopBaoCao",
      key: "ngayNopBaoCao",
      render: (data) => <>{dayjs(data).format("DD/MM/YYYY")}</>,
      className: "text-center",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThaiDuyetBaoCao",
      key: "trangThaiDuyetBaoCao",
      className: "text-center",
      render: (value) => {
        let text = "";
        let className = "";
        switch (value) {
          case TrangThaiDuyetBaoCaoEnum.ChoDuyet:
            text = "Chờ duyệt";
            className = "warning";
            break;
          case TrangThaiDuyetBaoCaoEnum.DongY:
            text = "Đồng ý";
            className = "success";
            break;
          case TrangThaiDuyetBaoCaoEnum.TuChoi:
            text = "Từ chối";
            className = "danger";
            break;
        }
        return (
          <div className="d-flex align-items-center justify-content-center">
            <div
              className={`text-center badge fw-bolder badge-light-${className}`}
            >
              {text}
            </div>
          </div>
        )
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 95,
      className: "text-center",
      render: (text, record) => {
        return (
          <div>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Xem chi tiết"
              onClick={() => {
                dispatch(actionsModal.setDataModal({ ...record, readOnly: true }));
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              <i className="fa fa-eye"></i>
            </a>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title={"Duyệt báo cáo"}
              onClick={() => {
                dispatch(actionsModal.setDataModal(record));
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              <i className="fas fa-check"></i>
            </a>
          </div>
        );
      },
    },
  ];


  return (
    <>
      <div className="card-body card-dashboard px-3 py-3">
        <div className="card-dashboard-body table-responsive">
          <TDTable<IBaoCaoDto>
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
