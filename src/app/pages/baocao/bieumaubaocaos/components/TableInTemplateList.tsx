/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Popconfirm, Checkbox, Spin } from "antd";
import { toast } from "react-toastify";
import { TableProps } from 'antd/es/table';
import { requestPOST, requestDELETE } from "@/utils/baseAPI";
import { Modal, Button } from "react-bootstrap";
import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { TDTable } from "@/app/components";
import { IBangTrongMauBaoCaoDto, IPaginationResponse, IResult } from "@/models";
import { RootState } from "@/redux";
import { AppDispatch } from "@/redux/Store";
import { SearchData } from "@/types";
import { MetricInTableModal, SelectMetricModal, TableDetailModal } from "./index";

const TableInTemplateList = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchData, setSearchData] = useState<SearchData | undefined>(undefined);
  const random = useSelector((state: RootState) => state.global.random);
  const modalTable = useSelector((state: RootState) => state.modal.modalTable);
  const modalTableDetail = useSelector((state: RootState) => state.modal.modalTableDetail);
  const modalMetricInTable = useSelector((state: RootState) => state.modal.modalMetricInTable);
  const modalSelectMetric = useSelector((state: RootState) => state.modal.modalSelectMetric);


  const [dataTable, setDataTable] = useState<IBangTrongMauBaoCaoDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IBangTrongMauBaoCaoDto[]>>('api/v1/bangtrongmaubaocaos/search', {
        pageNumber: currentPage,
        pageSize,
        ...searchData,
        bieuMauBaoCaoId: modalTable?.bieuMauBaoCao?.id,
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
    async (type: string, record: IBangTrongMauBaoCaoDto): Promise<void> => {
      try {
        switch (type) {
          case 'chi-tiet':
            dispatch(actionsModal.setModalTableDetail({
              visible: true,
              bangTrongMauBaoCao: record
            }));
            break;
          case 'delete':
            // eslint-disable-next-line no-case-declarations
            const response = await requestDELETE<IResult<boolean>>(`api/v1/bangtrongmaubaocaos/${record.id}`);
            if (response?.data?.succeeded) {
              toast.success('Xóa thành công!');
              dispatch(actionsGlobal.setRandom());
            } else {
              toast.error(response?.data?.message || 'Xóa thất bại, vui lòng thử lại!');
            }
            break;
          case "reportMetric":
            dispatch(actionsModal.setModalMetricInTable({
              visible: true, bangTrongMauBaoCao: record,
            }));
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

  const handleCancel = () => {
    dispatch(actionsModal.setModalTable({ visible: false }));
  };

  const columns: TableProps<IBangTrongMauBaoCaoDto>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'text-center',
      render: (text, record, index) => <div>{(currentPage - 1) * pageSize + index + 1}</div>,
    },
    {
      title: "Tên ",
      dataIndex: "ten",
      key: "ten",
    },
    {
      title: "Mã",
      dataIndex: "ma",
      key: "ma",
    },
    {
      title: "Sử dụng",
      dataIndex: "suDung",
      key: "suDung",
      className: "text-center",
      render: (text, record) => {
        return <Checkbox checked={record.suDung ? true : false} disabled />;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "moTa",
      key: "moTa",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Chỉ tiêu trong mẫu báo cáo"
              onClick={() => {
                handleAction(`reportMetric`, record);
              }}
            >
              <i className="fa fa-wrench"></i>
            </a>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Xem chi tiết/Sửa"
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
              <a
                className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1"
                data-toggle="m-tooltip"
                title="Xoá"
              >
                <i className="fa fa-trash"></i>
              </a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchData(prev => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const handleAddNew = (): void => {
    dispatch(actionsModal.setModalTableDetail({
      visible: true,
      bangTrongMauBaoCao: {
        bieuMauBaoCaoId: modalTable?.bieuMauBaoCao?.id
      }
    }));
  };

  return (
    <Modal
      show={modalTable.visible || false}
      fullscreen={true}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Bảng trong biểu mẫu báo cáo</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loading}>
          {!loading && (
            <>
              <div className="card card-xl-stretch mb-xl-9">
                <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
                  <span className="fs-5">
                    <i className="text-decoration-underline me-3">Biểu mẫu:</i>
                    <i>{modalTable?.bieuMauBaoCao?.ten}</i>
                  </span>
                  <div className="card-toolbar">
                    <div className="btn-group me-2 w-200px">
                      <input type="text" className="form-control form-control-sm" placeholder="Nhập từ khoá tìm kiếm" onChange={handleKeywordChange} />
                    </div>

                    <button className="btn btn-success btn-sm py-2 me-2" onClick={handleAddNew}>
                      <span>
                        <i className="fas fa-plus  me-2"></i>
                        <span className="">Thêm mới</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                </div>
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-xl-12">
                      <TDTable<IBangTrongMauBaoCaoDto>
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
                </div>
              </div>
              {modalTableDetail.visible ? <TableDetailModal /> : <></>}
              {modalMetricInTable.visible ? <MetricInTableModal /> : <></>}
              {modalSelectMetric.visible ? <SelectMetricModal /> : <></>}
            </>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <Button
            className="btn-sm btn-secondary rounded-1 p-2 ms-2"
            onClick={handleCancel}
          >
            <i className="fa fa-times me-2"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export { TableInTemplateList };
