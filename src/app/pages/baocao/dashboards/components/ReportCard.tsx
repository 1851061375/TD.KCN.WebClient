import { ReportApprovedList, ReportList, ReportSubmittedList } from "./index";
import { useState, useEffect } from "react";
import { Checkbox, Col, DatePicker, Form, Radio, Row, Select } from "antd";
import Collapse from "react-bootstrap/Collapse";
import { requestPOST } from "@/utils/baseAPI";
import _ from "lodash";
import { KTIcon } from "@/_metronic/helpers";
import { BoLocBaoCaoEnum, IBaoCaoDto, IKyBaoCaoDto, ILoaiBaoCaoDto, IPaginationResponse, ISoKyBaoCaoDto, TrangThaiBaoCaoEnum } from "@/models";
import { AppDispatch, RootState } from "@/redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { TDSelect } from "@/app/components";
import { DefaultOptionType } from "antd/es/select";
import { IReportFilter } from "../DashboardWrapper";



const ReportCard = ({ className, reportFilter, setReportFilter, form }) => {
  const dispatch: AppDispatch = useDispatch();
  const countBaoCao = useSelector((state: RootState) => state.modal.countBaoCao);
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(true);
  const [reportTypes, setReportTypes] = useState<ILoaiBaoCaoDto[]>([]);

  const [viewHienThi, setViewHienThi] = useState<BoLocBaoCaoEnum>(BoLocBaoCaoEnum.DanhSach);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [open, setOpen] = useState(false);
  const [kyBaoCaos, setKyBaoCaos] = useState<IKyBaoCaoDto[]>([]);
  const [soKyBaoCaos, setSoKyBaoCaos] = useState<ISoKyBaoCaoDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPOST<IPaginationResponse<ILoaiBaoCaoDto[]>>(
          `api/v1/loaibaocaos/search`,
          {
            pageNumber: currentPage,
            pageSize,
          }
        );
        if (response.data) {
          const { data } = response.data;
          setReportTypes(data ?? []);
        } else {
          setReportTypes([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => { };
  }, []);

  useEffect(() => {
    if (reportFilter?.loaiBaoCaoId) {
      setCurrentPage(1);
    }
  }, [reportFilter.loaiBaoCaoId]);

  useEffect(() => {
    if (reportTypes.length === 0) return;
    setReportFilter((prev) => ({
      ...prev,
      loaiBaoCaoId: reportTypes[0]?.id,
    }));
    form.setFieldValue("loaiBaoCaoId", reportTypes[0]?.id ?? null);

    return () => { };
  }, [reportTypes]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPOST<IPaginationResponse<IKyBaoCaoDto[]>>(`api/v1/kybaocaos/search`, {
          advancedSearch: {
            fields: ["name"],
            keyword: null,
          },
          pageNumber: 1,
          pageSize: 1000,
        });
        if (response.data) {
          const { data } = response.data;
          setKyBaoCaos(data ?? []);
        } else {
          setKyBaoCaos([]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setKyBaoCaos([]);
      }

    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPOST<IPaginationResponse<ISoKyBaoCaoDto[]>>(`api/v1/sokybaocaos/search`, {
          advancedSearch: {
            fields: ["name"],
            keyword: null,
          },
          pageNumber: 1,
          pageSize: 1000,
          kyBaoCaoId: reportFilter.kyBaoCaoId,
        });
        if (response.data) {
          const { data } = response.data;
          setSoKyBaoCaos(data ?? []);
        } else {
          setSoKyBaoCaos([]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setSoKyBaoCaos([]);
      }

    };
    if (reportFilter.kyBaoCaoId)
      fetchData();
    else
      setSoKyBaoCaos([]);
  }, [reportFilter.kyBaoCaoId]);

  return (
    <Form<IReportFilter> form={form} layout="vertical" autoComplete="off" className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <div className="card-toolbar">
          <ul className="nav">
            <li className="nav-item">
              <a
                className="nav-link btn btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1 fs-5"
                data-bs-toggle="tab"
                href="#kt_table_danh_sach_bao_cao"
                onClick={() => {
                  setViewHienThi(BoLocBaoCaoEnum.DanhSach);
                  setShowAdvanceFilter(true)
                }}
              >
                Danh sách báo cáo
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link btn btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1 fs-5"
                data-bs-toggle="tab"
                href="#kt_table_bao_cao_da_gui"
                onClick={() => {
                  setViewHienThi(BoLocBaoCaoEnum.ChoDuyet);
                  setShowAdvanceFilter(false)
                }}
              >
                Báo cáo chờ duyệt
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link btn btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1 fs-5"
                data-bs-toggle="tab"
                href="#kt_table_bao_cao_da_duyet"
                onClick={() => {
                  setViewHienThi(BoLocBaoCaoEnum.DaDuyet);
                  setShowAdvanceFilter(false)
                }}
              >
                Báo cáo đã duyệt
              </a>
            </li>
            {/* <li className="nav-item">
              <a
                className="nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4"
                data-bs-toggle="tab"
                href="#kt_table_widget_5_tab_3"
              >
                Day
              </a>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="ms-10"   >
        <Form.Item
          className="mb-2 mt-2"
          name="loaiBaoCaoId"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Radio.Group
            onChange={(e) =>
              setReportFilter((prev) => ({
                ...prev,
                loaiBaoCaoId: e.target.value,
              }))
            }
          >
            {reportTypes && reportTypes.length > 0 &&
              reportTypes?.map((item, key) => (
                <Radio
                  style={{ marginRight: "24px" }}
                  key={key}
                  value={item.id}
                  id={item.id}
                >
                  <span className="fw-bold">{item.ten}</span>
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
      </div>
      {showAdvanceFilter ? (
        <>
          <div className="ms-10 d-flex">
            <a
              onClick={(e) => {
                setReportFilter((prev) => ({
                  ...prev,
                  trangThaiBaoCao: null,
                }));
              }}
              className={`btn btn-sm btn-outline btn-outline-primary pulse pulse-primary me-2 mb-2 ${reportFilter?.trangThaiBaoCao === null ? "active" : ""
                }`}
            >
              Tất cả <span className="badge badge-circle badge-primary ms-2">{countBaoCao.tatCa}</span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                setReportFilter((prev) => ({
                  ...prev,
                  trangThaiBaoCao: TrangThaiBaoCaoEnum.DenHan,
                }));
              }}
              className={`btn btn-sm btn-outline btn-outline-success me-2 mb-2 ${reportFilter?.trangThaiBaoCao === TrangThaiBaoCaoEnum.DenHan ? "active" : ""
                }`}
            >
              Đến hạn<span className="badge badge-circle badge-success ms-2">{countBaoCao.denHan}</span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                setReportFilter((prev) => ({
                  ...prev,
                  trangThaiBaoCao: TrangThaiBaoCaoEnum.QuaHan,
                }));
              }}
              className={`btn btn-sm btn-outline btn-outline-danger me-2 mb-2 ${reportFilter?.trangThaiBaoCao === TrangThaiBaoCaoEnum.QuaHan ? "active" : ""
                }`}
            >
              Quá hạn<span className="badge badge-circle badge-danger ms-2">{countBaoCao.quaHan}</span>
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                setReportFilter((prev) => ({
                  ...prev,
                  trangThaiBaoCao: TrangThaiBaoCaoEnum.ChuaDenHan,
                }));
              }}
              className={`btn btn-sm btn-outline btn-outline-warning me-2 mb-2 ${reportFilter?.trangThaiBaoCao === TrangThaiBaoCaoEnum.ChuaDenHan ? "active" : ""
                }`}
            >
              Chưa đến hạn
              <span className="badge badge-circle badge-warning ms-2">{countBaoCao.chuaDenHan}</span>
            </a>
            <div className="card-toolbar">
              <div className="btn-group me-2 w-200px">
                <input type="text" className="form-control form-control-sm" placeholder="Nhập từ khoá tìm kiếm"
                  onChange={(e) =>
                    setReportFilter((prev) => ({
                      ...prev,
                      keyword: e.target.value,
                    }))} />
              </div>
              <button
                type="button"
                aria-expanded={open}
                className="btn btn-secondary btn-sm m-btn m-btn--icon py-2 me-2"
                onClick={() => setOpen(!open)}
              >
                <span>
                  <KTIcon iconName="filter" className="fs-4" />
                </span>
              </button>

            </div>

          </div>
          <div className="ms-10">
            <Collapse in={open}>
              <div>
                <div className="row">
                  <div className="col-xl-3 col-lg-3">
                    <Form.Item
                      label=""
                      name="namBaoCao"
                    >
                      <DatePicker
                        onChange={(e) =>
                          setReportFilter((prev) => ({
                            ...prev,
                            namBaoCao: e?.year(),
                          }))
                        }
                        placeholder="Năm báo cáo"
                        picker="year"
                        disabledDate={(current) =>
                          current && current.year() > new Date().getFullYear()
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <Form.Item
                      label=""
                      name="kyBaoCao"
                    >
                      <Select
                        showSearch
                        allowClear
                        placeholder="Kỳ báo cáo"
                        filterOption={(input, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(value, current) => {
                          setReportFilter((prev) => ({
                            ...prev,
                            kyBaoCaoId: value ? current?.id : null,
                            soKyBaoCaoId: null,
                          }))
                          form.setFieldsValue({
                            kyBaoCaoId: value ? current?.id : null,
                            soKyBaoCaoId: null,
                            soKyBaoCao: null,
                          });
                        }}
                        options={kyBaoCaos.map((item) => ({
                          ...item,
                          label: item.ten,
                          value: item.id,
                        }))}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <Form.Item
                      label=""
                      name="soKyBaoCao"
                    >
                      <Select
                        allowClear
                        placeholder="Số kỳ báo cáo (chọn kỳ báo cáo trước)"
                        filterOption={(input, option: any) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(value, current) => {
                          setReportFilter((prev) => ({
                            ...prev,
                            soKyBaoCaoId: value ? current?.id : null,
                          }));
                          form.setFieldsValue({
                            soKyBaoCaoId: value ? current?.id : null,
                          });
                        }}
                        options={soKyBaoCaos.map((item) => ({
                          ...item,
                          label: item.ten,
                          value: item.id,
                        }))}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </>

      ) : (
        <div className="ms-10 me-10 w-50">
          <div className="alert alert-dismissible bg-light-primary border border-primary border-dashed d-flex flex-column flex-sm-row w-100 p-5 mb-10">
            <i className="ki-duotone ki-notification-bing fs-2hx text-primary me-4 mb-5 mb-sm-0">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <div className="d-flex flex-column pe-0 pe-sm-10">
              <h5 className="mb-1">Lưu ý</h5>
              {viewHienThi === BoLocBaoCaoEnum.ChoDuyet ?
                <i>Đơn vị có thể gửi lại báo cáo trong thời gian chờ duyệt.</i> :
                <i>Đơn vị có thể gửi lại báo cáo trong thời hạn nộp.</i>}
            </div>
          </div>
        </div>
      )}

      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body py-0">
        <div className="tab-content">
          {/* begin::Tab pane */}
          <div
            className="tab-pane fade show active"
            id="kt_table_danh_sach_bao_cao"
          >
            {/* begin::Table container */}
            <ReportList
              reportFilter={reportFilter}
              viewHienThi={viewHienThi}
            />
            {/* end::Table container */}
          </div>
          <div className="tab-pane fade" id="kt_table_bao_cao_da_gui">
            {/* begin::Table container */}
            <ReportSubmittedList
              reportFilter={reportFilter}
              viewHienThi={viewHienThi}
            />
            {/* end::Table container */}
          </div>
          {/* end::Tab pane */}
          <div className="tab-pane fade" id="kt_table_bao_cao_da_duyet">
            {/* begin::Table container */}
            <ReportApprovedList
              reportFilter={reportFilter}
              viewHienThi={viewHienThi}
            />
            {/* end::Table container */}
          </div>
          {/* end::Tab pane */}
        </div>
      </div>
      {/* end::Body */}
    </Form>
  );
};

export { ReportCard };
