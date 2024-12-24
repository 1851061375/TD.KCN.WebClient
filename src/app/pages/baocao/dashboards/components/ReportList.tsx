/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { requestPOST } from "@/utils/baseAPI";
import { ReportModal } from "./index";
import { AppDispatch, RootState } from "@/redux/Store";
import { BoLocBaoCaoEnum, IBaoCaoDto, IPaginationBaoCaoResponse, TrangThaiBaoCaoEnum } from "@/models";
import { toast } from "react-toastify";
import { TableProps } from "antd";
import * as actionsModal from '@/redux/modal/Actions';
import dayjs from "dayjs";
import { TDTable } from "@/app/components";

const ReportList = (props) => {
  const { reportFilter, searchData, viewHienThi } = props;
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
      const response = await requestPOST<IPaginationBaoCaoResponse<IBaoCaoDto[]>>('api/v1/dashboardbaocao/baocao/search', {
        pageNumber: currentPage,
        pageSize,
        loaiBaoCaoId: reportFilter.loaiBaoCaoId,
        trangThaiBaoCao: reportFilter.trangThaiBaoCao,
        namBaoCao: reportFilter.namBaoCao,
        kyBaoCaoId: reportFilter.kyBaoCaoId,
        soKyBaoCaoId: reportFilter.soKyBaoCaoId,
        keyword: reportFilter?.keyword,
      });

      if (response.data) {
        const { data, totalCount } = response.data;
        setDataTable(data ?? []);
        dispatch(actionsModal.setCountBaoCao({
          tatCa: response.data.tatCa,
          denHan: response.data.denHan,
          chuaDenHan: response.data.chuaDenHan,
          quaHan: response.data.quaHan,
        }));
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
    if (!isRefreshing &&
      reportFilter.loaiBaoCaoId &&
      viewHienThi == BoLocBaoCaoEnum.DanhSach) {
      setIsRefreshing(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchData, random, reportFilter, viewHienThi]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchData, reportFilter, viewHienThi]);

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
      dataIndex: "ten",
      key: "ten",
      render: (text, record) => {
        return record.trangThaiBaoCao == TrangThaiBaoCaoEnum.DenHan ? (
          <span
            className="p-2"
            data-toggle="m-tooltip"
            title="Báo cáo đến hạn nộp"
          >
            <i className="text-center text-success far fa-clock me-2"></i>
            <>
              <a
                className="fw-bold"
                data-toggle="m-tooltip"
                title={`Bấm để gửi báo cáo`}
                style={{ textAlign: "center" }}
                onClick={() => {
                  dispatch(actionsModal.setDataModal(record));
                  dispatch(actionsModal.setModalVisible(true));
                }}
              >
                {text}
              </a>
            </>
          </span>
        ) : record.trangThaiBaoCao == TrangThaiBaoCaoEnum.ChuaDenHan ? (
          <span
            className="p-2"
            data-toggle="m-tooltip"
            title="Báo cáo chưa đến hạn nộp"
          >
            <i className="text-center text-warning far fa-clock me-2"></i>
            <span className="fw-bold">{text}</span>
          </span>
        ) : (
          <span
            className="p-2"
            data-toggle="m-tooltip"
            title="Báo cáo quá hạn nộp"
          >
            <i className="text-center text-danger fas fa-exclamation-triangle me-2"></i>
            <>
              <a
                className="fw-bold"
                data-toggle="m-tooltip"
                title={`Bấm để gửi báo cáo`}
                style={{ textAlign: "center" }}
                onClick={() => {
                  dispatch(actionsModal.setDataModal(record));
                  dispatch(actionsModal.setModalVisible(true));
                }}
              >
                {text}
              </a>
            </>
          </span>
        );
      },
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
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThaiBaoCaoTen",
      key: "trangThaiBaoCaoTen",
      className: "text-center",
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
            {(record.trangThaiBaoCao == TrangThaiBaoCaoEnum.DenHan ||
              record.trangThaiBaoCao == TrangThaiBaoCaoEnum.QuaHan) && (
                <a
                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
                  data-toggle="m-tooltip"
                  title="Gửi báo cáo"
                  onClick={() => {
                    dispatch(actionsModal.setDataModal(record));
                    dispatch(actionsModal.setModalVisible(true));
                  }}
                >
                  <i className="fa fa-share"></i>
                </a>
              )
            }
          </div>

        );
      },
    },
  ];
  return (
    <>
      <div className="card-body card-dashboard px-0 py-0">
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
      {modalVisible ? <ReportModal /> : <></>}
    </>
  );
};

export { ReportList };
