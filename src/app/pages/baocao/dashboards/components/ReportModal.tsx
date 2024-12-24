import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Form, Input, Spin, Upload, DatePicker } from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import * as authHelper from "@/app/modules/auth/core/AuthHelpers";
import { downloadReport, handleImage } from "@/utils/utils";
import {
  requestPOST,
  requestGET,
  API_URL,
} from "@/utils/baseAPI";


import { getAuth, useAuth } from "@/app/modules/auth";

import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";
import { AppDispatch, RootState } from "@/redux/Store";
import { IBaoCaoDaNopDto, IBaoCaoDto, IBieuMauBaoCaoDto, IPaginationResponse, IResult, TrangThaiDuyetBaoCaoEnum } from "@/models";
import { HeaderTitle, TDSelect } from "@/app/components";
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("vi");

const FormItem = Form.Item;

const ReportModal = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const { currentUser } = useAuth();
  console.log(currentUser);

  const baoCaoData = useSelector((state: RootState) => state.modal.dataModal) as IBaoCaoDto | null;
  const baoCaoDaNopId = baoCaoData!.baoCaoDaNopId;
  //const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IBaoCaoDaNopDto | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);

  const [form] = Form.useForm<IBaoCaoDaNopDto>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [dinhKem, setDinhKem] = useState<any[]>([]);
  const [dinhKemScan, setDinhKemScan] = useState<any[]>([]);
  const token = getAuth()?.token;


  useEffect(() => {
    async function fetchData() {
      const _data = { ...baoCaoData };
      _data.kyBaoCao = _data?.kyBaoCaoId
        ? {
          value: _data?.kyBaoCaoId ?? null,
          label: _data?.kyBaoCaoTen ?? null,
        }
        : null;

      _data.soKyBaoCao = _data?.soKyBaoCaoId
        ? {
          value: _data?.soKyBaoCaoId ?? null,
          label: _data?.soKyBaoCaoTen ?? null,
        }
        : null;

      _data.kyHanNopBaoCao = _data?.kyHanNopBaoCaoId
        ? {
          value: _data?.kyHanNopBaoCaoId ?? null,
          label: _data?.kyHanNopBaoCaoTen ?? null,
        }
        : null;

      _data.hanNop = _data?.hanNop
        ? dayjs(_data.hanNop)
        : null;
      if (_data?.dinhKem) {
        var dinhKem = handleImage(_data.dinhKem, API_URL);
        setDinhKem(dinhKem);
      }

      if (_data?.dinhKemScan) {
        var dinhKemScan = handleImage(_data.dinhKemScan, API_URL);
        setDinhKemScan(dinhKemScan);
      }

      form.setFieldsValue(_data);
    }
    fetchData();
  }, []);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    setButtonLoading(true);
    try {
      const formData = form.getFieldsValue(true);

      formData.organizationUnitId = currentUser?.organizationUnitId;
      formData.Ma = [
        currentUser!.organizationUnitCode,
        formData.namBaoCao,
        formData.bieuMauBaoCaoMa,
        formData.kyBaoCaoMa,
        formData.soKyBaoCaoMa,
      ].join("#");

      formData.dinhKem = dinhKem.length > 0
        ? dinhKem[0]?.response?.data[0]?.url ?? dinhKem[0].path
        : null;

      formData.dinhKemScan = dinhKemScan.length > 0
        ? dinhKemScan[0]?.response?.data[0]?.url ?? dinhKemScan[0].path
        : null;

      formData.hanNop = formData.hanNop;
      const response = await requestPOST<IResult<string>>(`api/v1/baocaodanops`, formData);
      if (response?.status == 200 && response?.data?.succeeded == true) {
        toast.success('Thao tác thành công!');
        dispatch(actionsGlobal.setRandom());
        handleCancel();
      } else {
        toast.error(response?.data?.message);
        console.error(response?.data?.message);
      }
    } catch (errorInfo) {
      toast.error('Thao tác thất bại, vui lòng thử lại!');
      console.error('Failed:', errorInfo);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDownload = async (reportTemplateId) => {
    try {
      const res = await requestGET<IResult<IBieuMauBaoCaoDto>>(
        `api/v1/bieumaubaocaos/${reportTemplateId}`
      );
      var attachmentPath = res?.data?.data?.dinhKem;

      const formData = form.getFieldsValue(true);
      const bucketName = attachmentPath!.split("/")[0];
      const key = attachmentPath!.split(bucketName)[1];
      const filter = {
        bucketName: bucketName,
        key: key,
        kyBaoCaoId: formData.kyBaoCaoId,
        soKyBaoCaoId: formData.soKyBaoCaoId,
        namBaoCao: formData.namBaoCao,
      };

      downloadReport(filter);
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      show={modalVisible}
      size="xl"
      fullscreen={"lg-down"}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">{baoCaoData?.readOnly != true ? "Gửi báo cáo" : "Chi tiết"}</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <Form form={form} layout="vertical" autoComplete="off">
              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  <HeaderTitle title={baoCaoData?.ten} />
                  <div className="d-flex align-items-center mb-4">
                    <a
                      className="p-2 d-flex align-items-center"
                      data-toggle="m-tooltip"
                      title="Bấm để tải biểu mẫu báo cáo"
                      onClick={() =>
                        handleDownload(
                          form.getFieldValue("bieuMauBaoCaoId") ?? null
                        )
                      }
                    >
                      <i
                        style={{ fontSize: "1.6rem" }}
                        className="text-center text-danger fas fa-exclamation-triangle me-3"
                      ></i>
                      <h4 className=" m-form-headtitle fst-italic me-1 mb-0 ms--10 text-danger text-decoration-underline">
                        Tải biểu mẫu báo cáo
                      </h4>
                    </a>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Kỳ báo cáo"
                        name="kyBaoCao"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <TDSelect
                          reload
                          disabled
                          showSearch
                          placeholder="Lựa chọn"
                          fetchOptions={async keyword => {
                            const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/kybaocaos/search`, {
                              pageNumber: 1,
                              pageSize: 1000,
                              keyword: keyword,
                              level: 1,
                            });
                            return (
                              res.data?.data?.map(item => ({
                                ...item,
                                label: item?.ten,
                                value: item?.id,
                              })) ?? []
                            );
                          }}
                          onChange={(value, current: any) => {
                            if (value) {
                              form.setFieldsValue({
                                kyBaoCaoId: current.value,
                              });
                            } else {
                              form.setFieldsValue({
                                kyBaoCaoId: null,
                              });
                            }
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Số kỳ báo cáo"
                        name="soKyBaoCao"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <TDSelect
                          reload
                          disabled
                          showSearch
                          placeholder="Lựa chọn"
                          fetchOptions={async keyword => {
                            const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/sokybaocaos/search`, {
                              pageNumber: 1,
                              pageSize: 1000,
                              keyword: keyword,
                              level: 1,
                            });
                            return (
                              res.data?.data?.map(item => ({
                                ...item,
                                label: item?.ten,
                                value: item?.id,
                              })) ?? []
                            );
                          }}
                          onChange={(value, current: any) => {
                            if (value) {
                              form.setFieldsValue({
                                soKyBaoCaoId: current.value,
                              });
                            } else {
                              form.setFieldsValue({
                                soKyBaoCaoId: null,
                              });
                            }
                          }}
                        />
                      </FormItem>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Năm"
                        name="namBaoCao"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <Input placeholder="" disabled />
                      </FormItem>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem label="Căn cứ pháp lý" name="decription">
                        <Input placeholder="" disabled />
                      </FormItem>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Đính kèm file báo cáo (chỉ đính kèm biểu đã tải về từ phần mềm)"
                        name="dinhKem"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <Upload.Dragger
                          name="files"
                          multiple={true}
                          fileList={dinhKem}
                          accept=".xls, .xlsx"
                          action={`${API_URL}/api/v1/attachments/public`}
                          headers={{
                            Authorization: `Bearer ${token}`,
                          }}
                          onChange={(e) => setDinhKem(e.fileList)}
                        >
                          <p className="ant-upload-text">
                            Kéo thả tập tin hoặc nhấp chuột để tải lên
                          </p>
                          <p className="ant-upload-hint"></p>
                        </Upload.Dragger>
                      </FormItem>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Đính kèm file scan"
                        name="dinhKemScan"
                      >
                        <Upload.Dragger
                          name="files"
                          multiple={true}
                          fileList={dinhKemScan}
                          accept=".xls, .xlsx"
                          action={`${API_URL}/api/v1/attachments/public`}
                          headers={{
                            Authorization: `Bearer ${token}`,
                          }}
                          onChange={(e) => setDinhKemScan(e.fileList)}
                        >
                          <p className="ant-upload-text">
                            Kéo thả tập tin hoặc nhấp chuột để tải lên
                          </p>
                          <p className="ant-upload-hint"></p>
                        </Upload.Dragger>
                      </FormItem>
                    </div>
                  </div>
                  <div className="row" hidden>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Kỳ hạn nộp báo cáo"
                        name="kyHanNopBaoCao"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <TDSelect
                          reload
                          showSearch
                          placeholder="Lựa chọn"
                          fetchOptions={async keyword => {
                            const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/kyhannopbaocaos/search`, {
                              pageNumber: 1,
                              pageSize: 1000,
                              keyword: keyword,
                              level: 1,
                            });
                            return (
                              res.data?.data?.map(item => ({
                                ...item,
                                label: item?.ten,
                                value: item?.id,
                              })) ?? []
                            );
                          }}
                          onChange={(value, current: any) => {
                            if (value) {
                              form.setFieldsValue({
                                kyHanNopBaoCaoId: current.value,
                              });
                            } else {
                              form.setFieldsValue({
                                kyHanNopBaoCaoId: null,
                              });
                            }
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Ngày hết hạn"
                        name="hanNop"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <DatePicker
                          locale={locale}
                          format="DD/MM/YYYY"
                          placeholder="DD/MM/YYYY"
                          style={{ width: "100%" }}
                        />
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        {baoCaoData?.trangThaiDuyetBaoCao != TrangThaiDuyetBaoCaoEnum.DongY &&
          baoCaoData?.trangThaiDuyetBaoCao != TrangThaiDuyetBaoCaoEnum.ChoDuyet &&
          baoCaoData?.readOnly != true && (
            <div className="d-flex justify-content-center  align-items-center">
              <Button
                className="btn-sm btn-success rounded-1 py-2 px-5  ms-2"
                onClick={onFinish}
                disabled={buttonLoading}
              >
                <i className="fa fa-save"></i>
                Gửi báo cáo
              </Button>
            </div>
          )}

        <div className="d-flex justify-content-center  align-items-center">
          <Button
            className="btn-sm btn-secondary rounded-1 p-2  ms-2"
            onClick={handleCancel}
          >
            <i className="fa fa-times"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export { ReportModal };
