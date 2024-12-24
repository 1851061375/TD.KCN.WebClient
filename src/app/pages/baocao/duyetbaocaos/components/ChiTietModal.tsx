import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input, Spin, Checkbox, InputNumber, Upload, DatePicker } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { RootState, AppDispatch } from '@/redux/Store';
import { toast } from 'react-toastify';
import _ from 'lodash';

import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { API_URL, requestGET, requestPOST, requestPUT } from '@/utils/baseAPI';
import { IBaoCaoDaNopDto, IPaginationResponse, IResult, TrangThaiDuyetBaoCaoEnum } from '@/models';
import { handleImage, removeAccents } from '@/utils/utils';
import { TDSelect } from '@/app/components';
import locale from "antd/es/date-picker/locale/vi_VN";
import "dayjs/locale/vi";
import { getAuth } from '@/app/modules/auth';

const FormItem = Form.Item;

const ModalItem = props => {
  const dispatch: AppDispatch = useDispatch();

  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IBaoCaoDaNopDto | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm<IBaoCaoDaNopDto>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [dinhKem, setDinhKem] = useState<any[]>([]);
  const [dinhKemScan, setDinhKemScan] = useState<any[]>([]);
  const token = getAuth()?.token;


  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IBaoCaoDaNopDto>>(`api/v1/baocaodanops/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data) {

          _data.bieuMauBaoCao = _data?.bieuMauBaoCaoId
            ? {
              value: _data?.bieuMauBaoCaoId ?? null,
              label: _data?.bieuMauBaoCaoTen ?? null,
            }
            : null;

          _data.organizationUnit = _data?.organizationUnitId
            ? {
              value: _data?.organizationUnitId ?? null,
              label: _data?.organizationUnitName ?? null,
            }
            : null;

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
      } catch (error) {
        console.error('Error fetching data: ', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async (trangThai: TrangThaiDuyetBaoCaoEnum) => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const formData: IBaoCaoDaNopDto = {
        ...values,
        ...(id && { id }),
        trangThaiDuyetBaoCao: trangThai,
      };

      const response = await requestPUT<IResult<string>>(`api/v1/baocaodanops/duyet/${id}`, formData)

      if (response?.status == 200) {
        toast.success("Thực hiện thành công!");
        dispatch(actionsGlobal.setRandom());
        handleCancel();
      } else {
        toast.error(response?.data?.message || 'Thao tác thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Modal
      show={modalVisible}
      fullscreen={'lg-down'}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">{dataModal?.readOnly != true ? "Duyệt báo cáo" : "Chi tiết"}</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <Form form={form} layout="vertical" autoComplete="off">
              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Tên báo cáo"
                        name="bieuMauBaoCao"
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
                            const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/bieumaubaocaos/search`, {
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
                                bieuMauBaoCaoId: current.value,
                              });
                            } else {
                              form.setFieldsValue({
                                bieuMauBaoCaoId: null,
                              });
                            }
                          }}
                        />
                      </FormItem>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Đơn vị báo cáo"
                        name="organizationUnit"
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
                            const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/organizationunits/search`, {
                              pageNumber: 1,
                              pageSize: 1000,
                              keyword: keyword,
                              level: 1,
                            });
                            return (
                              res.data?.data?.map(item => ({
                                ...item,
                                label: item?.name,
                                value: item?.id,
                              })) ?? []
                            );
                          }}
                          onChange={(value, current: any) => {
                            if (value) {
                              form.setFieldsValue({
                                bieuMauBaoCaoId: current.value,
                              });
                            } else {
                              form.setFieldsValue({
                                bieuMauBaoCaoId: null,
                              });
                            }
                          }}
                        />
                      </FormItem>
                    </div>
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
                          // action={`${API_URL}/api/v1/attachments/report`}
                          // headers={{
                          //   Authorization: `Bearer ${token}`,
                          // }}
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
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        {dataModal?.trangThaiDuyetBaoCao == TrangThaiDuyetBaoCaoEnum.ChoDuyet &&
          dataModal?.readOnly != true && (
            <>
              <div className="d-flex justify-content-center align-items-center">
                <Button className="btn-sm btn-success rounded-1 py-2 px-5 ms-2" onClick={() => onFinish(TrangThaiDuyetBaoCaoEnum.DongY)} disabled={buttonLoading}>
                  <i className="fas fa-check me-2"></i>
                  Đồng ý
                </Button>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <Button className="btn-sm btn-danger rounded-1 py-2 px-5 ms-2" onClick={() => onFinish(TrangThaiDuyetBaoCaoEnum.TuChoi)} disabled={buttonLoading}>
                  <i className="fa fa-times me-2"></i>Từ chối
                </Button>
              </div>
            </>

          )}

        <div className="d-flex justify-content-center align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 py-2 px-5 ms-2" onClick={handleCancel}>
            <i className="fa fa-times me-2"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
