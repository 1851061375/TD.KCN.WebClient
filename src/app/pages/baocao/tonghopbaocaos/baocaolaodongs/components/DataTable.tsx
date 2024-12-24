/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { toast } from "react-toastify";
import { requestPOST } from "@/utils/baseAPI";
import moment from "moment";
import { KTIcon } from "@/_metronic/helpers";
import { AppDispatch, RootState } from "@/redux/Store";
import { IBaoCaoDto, IPaginationResponse, ITongHopBaoCaoDto } from "@/models";
import * as actionsModal from '@/redux/modal/Actions';
import { TDTable } from "@/app/components";
import { downloadAttachment, getFileName } from "@/utils/utils";
// import { getFileName, downloadAttachment } from "@/utils/utils";

const DataTable = ({ searchData }) => {
  const dispatch: AppDispatch = useDispatch();
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const random = useSelector((state: RootState) => state.global.random);


  const [dataTable, setDataTable] = useState<ITongHopBaoCaoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showType, setShowType] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await requestPOST<IPaginationResponse<ITongHopBaoCaoDto[]>>(
          `api/v1/tonghopbaocaos/search`, {
          baoCaoMa: searchData?.baoCaoMa ?? null,
          organizationUnitId: searchData?.organizationUnitId ?? null,
          userId: searchData?.userId ?? null,
          soKyBaoCaoId: searchData?.soKyBaoCaoId ?? null,
          kyBaoCaoId: searchData?.kyBaoCaoId ?? null,
          trangThaiNopBaoCao: searchData?.trangThaiNopBaoCao ?? null,
          namBaoCao: searchData?.namBaoCao ?? null,
          pageNumber: currentPage,
          pageSize: pageSize,
        },
        );
        await new Promise(resolve => setTimeout(resolve, 500));
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
    if (searchData != null) fetchData();

    return () => { };
  }, [currentPage, pageSize, searchData, random]);

  useEffect(() => {
    if (searchData != null && searchData.reportStatus != null) {
      var reportStatus = searchData.reportStatus.split(",");
      if (
        reportStatus.includes("submitted") &&
        reportStatus.includes("notsubmit")
      ) {
        setShowType("all");
      } else {
        setShowType(searchData.reportStatus);
      }
    }
  }, [searchData]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'text-center',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: "Mã đơn vị",
      dataIndex: "organizationUnitCode",
      key: "organizationUnitCode",
      className: "text-center",
      width: 180,
    },
    {
      title: "Tên đơn vị",
      dataIndex: "organizationUnitName",
      key: "organizationUnitName",
      render: (text, record) =>
        record.reportType == 1 || record.reportType == -1 ? (
          <>
            <a
              className="fw-bold"
              data-toggle="m-tooltip"
              title={`Xem báo cáo đã nộp`}
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
      title: "Báo cáo doanh nghiệp nộp",
      dataIndex: "baoCaoDaNopId",
      width: 250,
      key: "baoCaoDaNopId",
      className: "text-center",
      render: (text, record) => {
        if (text != null && record.dinhKem != null) {
          return (
            <>
              <span className="badge fs-7 fw-bolder badge-light-success">
                Đã nộp
              </span>
              {moment(record.submittedDate).format("hh:mm A DD/MM/YYYY")}
              <br></br>
              <span className="badge fs-7 fw-bolder p-0">
                File:{" "}
                <a
                  className="p-2 d-flex align-items-center"
                  data-toggle="m-tooltip"
                  title={getFileName(record.dinhKem)}
                  onClick={() => downloadAttachment(record.dinhKem)}
                >
                  <KTIcon iconName="paper-clip" className="fs-3 text-primary" />
                </a>
              </span>
            </>
          );
        } else {
          return (
            <>
              <span className="badge fw-bolder badge-light-danger">
                Chưa nộp
              </span>
            </>
          );
        }
      },
    },
  ];
  return (
    <>
      <div className="card-body card-dashboard py-4 pt-0">
        {/* {!loading && dataTable && (
          <div className="d-flex flex-column">
            {showType == "all" && (
              <li className="d-flex align-items-center py-2 fw-bold fs-5">
                <span className="bullet bg-primary me-2"></span>{" "}
                <span className=" text-primary me-2">
                  Tổng số doanh nghiệp:{" "}
                </span>
                <span className="">{dataTable.totalCount}</span>
              </li>
            )}
            {(showType == "submitted" || showType == "all") && (
              <li class="d-flex align-items-center py-2 fw-bold fs-5">
                <span class="bullet bg-success me-2"></span>{" "}
                <span className=" text-success me-2">
                  Số doanh nghiệp đã nộp:{" "}
                </span>
                <span className="">{data.submitted}</span>
              </li>
            )}
            {(showType == "notsubmit" || showType == "all") && (
              <li class="d-flex align-items-center py-2 fw-bold fs-5">
                <span class="bullet bg-danger me-2"></span>{" "}
                <span className=" text-danger me-2">
                  Số doanh nghiệp chưa nộp:{" "}
                </span>
                <span className="">{data.notSubmitted}</span>
              </li>
            )}
          </div>
        )} */}
        <div className="card-dashboard-body table-responsive">
          <TDTable<ITongHopBaoCaoDto>
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
      {/* {modalVisible ? <ReportModal /> : <></>} */}
    </>
  );
};

export default DataTable;
