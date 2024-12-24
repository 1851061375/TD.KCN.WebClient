import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { requestPOST } from "@/utils/baseAPI";
import { AppDispatch, RootState } from "@/redux/Store";
import { BoLocBaoCaoEnum, IBaoCaoDto, IPaginationResponse, TrangThaiBaoCaoEnum, TrangThaiDuyetBaoCaoEnum } from "@/models";
import { toast } from "react-toastify";
import { TableProps } from "antd";
import dayjs from "dayjs";
import * as actionsModal from '@/redux/modal/Actions';
import { TDTable } from "@/app/components";

const ReportApprovedList = (props) => {
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
      const response = await requestPOST<IPaginationResponse<IBaoCaoDto[]>>('api/v1/dashboardbaocao/baocaodanop/search', {
        pageNumber: currentPage,
        pageSize,
        loaiBaoCaoId: reportFilter.loaiBaoCaoId,
        trangThaiDuyetBaoCao: TrangThaiDuyetBaoCaoEnum.DongY,
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
    if (!isRefreshing &&
      reportFilter.loaiBaoCaoId &&
      viewHienThi == BoLocBaoCaoEnum.DaDuyet) {
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
      title: "",
      dataIndex: "trangThaiBaoCao",
      key: "trangThaiBaoCao",
      width: 50,
      className: "text-center",
      render: (data) => {
        return data == TrangThaiBaoCaoEnum.DenHan ? (
          <span
            className="p-2"
            data-toggle="m-tooltip"
            title="Báo cáo đến hạn nộp"
          >
            <i className="text-center text-success far fa-clock"></i>
          </span>
        ) : data == TrangThaiBaoCaoEnum.ChuaDenHan ? (
          <span
            className="p-2"
            data-toggle="m-tooltip"
            title="Báo cáo chưa đến hạn nộp"
          >
            <i className="text-center text-warning far fa-clock"></i>
          </span>
        ) : (
          <span
            className="p-2"
            data-toggle="m-tooltip"
            title="Báo cáo quá hạn nộp"
          >
            <i className="text-center text-danger fas fa-exclamation-triangle"></i>
          </span>
        );
      },
    },
    {
      title: "Tên báo cáo",
      dataIndex: "ten",
      key: "ten",
      render: (text, record) =>
        record.trangThaiBaoCao == TrangThaiBaoCaoEnum.DenHan ? (
          <>
            <a
              className="fw-bold"
              data-toggle="m-tooltip"
              title={`Bấm để cập nhật báo cáo (chỉ có thể cập nhật báo cáo trong thời hạn nộp)`}
              style={{ textAlign: "center" }}
              onClick={() => {
                dispatch(actionsModal.setDataModal(record));
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              {text}
            </a>
          </>
        ) : (
          <span className="fw-bold">{text}</span>
        ),
    },
    {
      title: "Kỳ báo cáo",
      dataIndex: "kyBaoCaoTen",
      key: "kyBaoCaoTen",
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
      dataIndex: "trangThaiBaoCaoTen",
      key: "trangThaiBaoCaoTen",
      className: "text-center",
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 75,
      className: "text-center",
      render: (text, record) => {
        return (
          <div>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title={record.trangThaiBaoCao == TrangThaiBaoCaoEnum.DenHan ? "Cập nhật báo cáo" : "Xem chi tiết"}
              onClick={() => {
                // dispatch(actionsModal.setModalBaoCaoDaNop({
                //   visible: true,
                //   data: record,
                // }));
                dispatch(actionsModal.setDataModal(record));
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              <i className="fa fa-eye"></i>
            </a>
          </div>
        );
      },
    },
  ];
  return (
    <>
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
      {/* {modalVisible ? <ReportSubmittedModal /> : <></>} */}
    </>
  );
};

export { ReportApprovedList };
