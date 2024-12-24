/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { Form, Select, Card, Checkbox, DatePicker, Row, Col } from "antd";
import Collapse from "react-bootstrap/Collapse";

import { KTIcon } from "@/_metronic/helpers";

import { requestPOST, requestPOSTAttachment } from "@/utils/baseAPI";
import { toast } from "react-toastify";
import DataTable from "./components/DataTable";
import { TDSelect } from "@/app/components";
import { IKyBaoCaoDto, ILoaiBaoCaoDto, ILoaiTongHopDto, IPaginationResponse, ISoKyBaoCaoDto, IUserDetails } from "@/models";
import { downloadReport } from "@/utils/utils";

const FormItem = Form.Item;

const BaoCaoLaoDongsPage = () => {


  const [form] = Form.useForm();
  const [open, setOpen] = useState(true);
  const [organizationUnitId, setOrganizationUnitId] = useState(null);
  const [users, setUsers] = useState<IUserDetails[]>([]);
  const [kyBaoCaos, setKyBaoCaos] = useState<IKyBaoCaoDto[]>([]);
  const [soKyBaoCaos, setSoKyBaoCaos] = useState<ISoKyBaoCaoDto[]>([]);
  const [searchData, setSearchData] = useState(null);
  const [tongHopFilter, setTongHopFilter] = useState(null);
  const [bieuMauBaoCaoMa, setBieuMauBaoCaoMa] = useState(null);
  const [kyBaoCaoId, setKyBaoCaoId] = useState(null);
  const [loaiBaoCaoId] = useState("3E000B57-F0BD-48B9-A109-08DD0DF8C26F");
  const [loaiTongHops, setLoaiTongHops] = useState<ILoaiTongHopDto[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await requestPOST<IPaginationResponse<IUserDetails[]>>(`api/v1/users/search`, {
  //         advancedSearch: {
  //           fields: ["name"],
  //           keyword: null,
  //         },
  //         pageNumber: 1,
  //         pageSize: 1000,
  //         organizationUnitId: organizationUnitId,
  //       });
  //       if (response.data) {
  //         const { data } = response.data;
  //         setUsers(data ?? []);
  //       } else {
  //         setUsers([]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data: ', error);
  //       toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
  //       setUsers([]);
  //     }

  //   };
  //   fetchData();
  // }, [organizationUnitId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPOST<IPaginationResponse<ILoaiTongHopDto[]>>(`api/v1/loaitonghops/search`, {
          advancedSearch: {
            fields: ["name"],
            keyword: null,
          },
          pageNumber: 1,
          pageSize: 1000,
          loaiBaoCaoId: loaiBaoCaoId,
        });
        if (response.data) {
          const { data } = response.data;
          setLoaiTongHops(data ?? []);
        } else {
          setLoaiTongHops([]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
        setLoaiTongHops([]);
      }

    };
    fetchData();
  }, [loaiBaoCaoId]);

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
          bieuMauBaoCaoMa: bieuMauBaoCaoMa,
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
  }, [bieuMauBaoCaoMa]);

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
          kyBaoCaoId: kyBaoCaoId,
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
    fetchData();
  }, [kyBaoCaoId]);

  const handleCompilation = async () => {
    try {
      const values = await form.validateFields();
      const formData = form.getFieldsValue(true);
      var dataTemp = {
        ...formData,
        namBaoCao: formData.namBaoCao?.year(),
        trangThaiNopBaoCao: formData.trangThaiNopBaoCao.join(","),
      };
      delete dataTemp.user;
      delete dataTemp.organizationUnit;
      delete dataTemp.kyBaoCao;
      delete dataTemp.soKyBaoCao;
      setSearchData(dataTemp);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      toast.error("Chưa nhập đủ thông tin!");
    }
  };

  const handlePrint = async () => {
    try {
      const values = await form.validateFields();
      const formData = form.getFieldsValue(true);
      var dataTemp = {
        ...formData,
        namBaoCao: formData.namBaoCao?.year(),
        trangThaiNopBaoCao: formData.trangThaiNopBaoCao.join(","),
      };
      delete dataTemp.user;
      delete dataTemp.organizationUnit;
      delete dataTemp.kyBaoCao;
      delete dataTemp.soKyBaoCao;

      const response = await requestPOSTAttachment(`api/v1/tonghopbaocaos/print`, dataTemp);
      const contentDisposition = response!.headers["content-disposition"];
      let fileName = "default-attachment.xlsx";
      if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        );
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, "");
        }
      }
      const fileData = new Blob([response!.data]);
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(fileData);
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      toast.error("Chưa nhập đủ thông tin!");
    }
  };


  return (
    <>
      <Card
        title="Tổng hợp báo cáo lao động"
        bordered={false}
        style={{ width: "100%" }}
      >
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          initialValues={{ trangThaiNopBaoCao: ["submitted", "notsubmit"] }}
        >
          <div className="row border-bottom border-secondary">
            <div className="col-xl-8 col-lg-8">
              <FormItem
                label=""
                name="baoCaoMa"
                rules={[
                  { required: true, message: "Không được để trống!" },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn"
                  filterOption={(input, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(value, current) => {
                    form.setFieldsValue({
                      baoCaoMa: value ? current?.ma : null,
                      kyBaoCao: null,
                      kyBaoCaoId: null,
                      soKyBaoCao: null,
                      soKyBaoCaoId: null,
                    });
                    setBieuMauBaoCaoMa(value);
                    setKyBaoCaoId(null);
                  }}
                  options={loaiTongHops.map((item) => ({
                    ...item,
                    label: item.ten,
                    value: item.ma,
                  }))}
                />
                {/* <TDSelect
                  reload
                  showSearch
                  placeholder="Chọn báo cáo"
                  fetchOptions={async keyword => {
                    const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/loaitonghops/search`, {
                      pageNumber: 1,
                      pageSize: 1000,
                      keyword: keyword,
                      level: 1,
                      loaiBaoCaoId: loaiBaoCaoId,
                    });
                    return (
                      res.data?.data?.map(item => ({
                        ...item,
                        label: item?.ten,
                        value: item?.ma,
                      })) ?? []
                    );
                  }}
                  onChange={(value, current: any) => {
                    if (value) {
                      form.setFieldsValue({
                        baoCaoMa: current.value,
                      });
                    } else {
                      form.setFieldsValue({
                        baoCaoMa: null,
                      });
                    }
                    setBieuMauBaoCaoMa(value);
                    setKyBaoCaoId(null);
                    var formData = form.getFieldsValue(true);
                    form.setFieldsValue({
                      ...formData,
                      kyBaoCao: null,
                      kyBaoCaoId: null,
                      soKyBaoCao: null,
                      soKyBaoCaoId: null,
                    });
                  }}
                /> */}

              </FormItem>
            </div>
            <div className="col-xl-4 col-lg-4 ">
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

              <button
                onClick={() => handleCompilation()}
                className="btn btn-primary btn-sm m-btn m-btn--icon py-2 me-2"
              >
                <span>
                  <i className="fas fa-chart-line me-2"></i>
                  <span className="">Tổng hợp</span>
                </span>
              </button>
              <button
                onClick={() => handlePrint()}
                className="btn btn-success btn-sm m-btn m-btn--icon py-2 me-2">
                <span>
                  <i className="fas fa-file-export me-2"></i>
                  <span className="">Xuất tổng hợp</span>
                </span>
              </button>
            </div>
          </div>
          <Collapse in={open}>
            <div>
              <div className="row mt-2">
                <div className="col-xl-4 col-lg-4">
                  <FormItem
                    label=""
                    name="trangThaiNopBaoCao"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Checkbox.Group style={{ width: "100%" }}>
                      <Row>
                        <Col span={8}>
                          <Checkbox value="submitted">Đã nộp</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="notsubmit">Chưa nộp</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  </FormItem>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-lg-4">
                  <FormItem label="Đơn vị" name="organizationUnit">
                    <TDSelect
                      showSearch
                      placeholder="Chọn"
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST<IPaginationResponse<any[]>>(
                          `api/v1/organizationunits/search`,
                          {
                            pageNumber: 1,
                            pageSize: 1000,
                            advancedSearch: {
                              fields: ["name"],
                              keyword: keyword || null,
                            },
                          }
                        );
                        return (
                          res.data?.data?.map(item => ({
                            ...item,
                            label: item?.name,
                            value: item?.id,
                          })) ?? []
                        );
                      }}
                      style={{ width: "100%" }}
                      onChange={(value, current: any) => {
                        if (value) {
                          setOrganizationUnitId(current.id);
                          form.setFieldsValue({ organizationUnitId: current.id });
                        } else {
                          setOrganizationUnitId(null);
                          form.setFieldsValue({ organizationUnitId: null });
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-4 col-lg-4">
                  {/* <FormItem label="Người dùng" name="user">
                    <Select
                      showSearch
                      allowClear
                      placeholder="Chọn"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value, current) => {
                        form.setFieldsValue({
                          companyId: value ? current?.id : null,
                        });
                      }}
                      options={users.map((item) => ({
                        ...item,
                        label: item.userName,
                        value: item.id,
                      }))}
                    />
                  </FormItem> */}
                </div>
                <div className="col-xl-4 col-lg-4"></div>
                <div className="col-xl-4 col-lg-4">
                  <FormItem
                    label="Năm"
                    name="namBaoCao"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <DatePicker
                      picker="year"
                      disabledDate={(current) =>
                        current && current.year() > new Date().getFullYear()
                      }
                    />
                  </FormItem>
                </div>
                <div className="col-xl-4 col-lg-4">
                  <FormItem
                    label="Kỳ báo cáo"
                    name="kyBaoCao"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Select
                      showSearch
                      allowClear
                      placeholder="Chọn"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value, current) => {
                        setKyBaoCaoId(value ? current?.id : null);
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
                  </FormItem>
                </div>
                <div className="col-xl-4 col-lg-4">
                  <FormItem
                    label="Số kỳ báo cáo"
                    name="soKyBaoCao"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Select
                      showSearch
                      allowClear
                      placeholder="Chọn"
                      filterOption={(input, option: any) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={(value, current) => {
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
                  </FormItem>
                </div>
              </div>
            </div>
          </Collapse>
        </Form>

        <DataTable searchData={searchData} />
      </Card>
    </>
  );
};

export default BaoCaoLaoDongsPage;
