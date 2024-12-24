import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input, Spin, Checkbox, InputNumber, Row, Col } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { RootState, AppDispatch } from '@/redux/Store';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { getAuth } from '@/app/modules/auth/core/AuthHelpers';

import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { API_URL, FILE_URL, requestGET, requestGETAttachment, requestPOST, requestPUT } from '@/utils/baseAPI';
import { IBieuMauBaoCaoDto, IPaginationResponse, IResult } from '@/models';
import { FileUpload, TDSelect } from '@/app/components';
import Dragger from 'antd/lib/upload/Dragger';
import { handleImage } from '@/utils/utils';
import { FILE } from 'dns';

const FormItem = Form.Item;

const ChiTietModal = props => {
  const dispatch: AppDispatch = useDispatch();

  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IBieuMauBaoCaoDto | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm<IBieuMauBaoCaoDto>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const token = getAuth()?.token;


  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IBieuMauBaoCaoDto>>(`api/v1/bieumaubaocaos/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data) {
          _data.loaiBaoCao = _data.loaiBaoCaoId ? { label: _data.loaiBaoCaoTen, value: _data.loaiBaoCaoId } : null;
          _data.kyBaoCao = _data.kyBaoCaoId ? { label: _data.kyBaoCaoTen, value: _data.kyBaoCaoId } : null;
          form.setFieldsValue(_data);

          if (_data?.dinhKem) {
            setFiles(_data?.dinhKem?.split(',').map((item, index) => ({
              uid: index,
              name: item.substring(item.lastIndexOf("/") + 1),
              status: 'done',
              url: FILE_URL + item,
            })) ?? []);
          }

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

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const formData: IBieuMauBaoCaoDto = {
        ...values,
        dinhKem: files.length > 0
          ? files[0]?.response?.data[0]?.url ?? files[0].path
          : null,
        ...(id && { id }),
      };
      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/bieumaubaocaos/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/bieumaubaocaos`, formData);

      if (response?.status == 200) {
        toast.success(id ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
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
        <Modal.Title className="text-white">Chi tiết</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <Form<IBieuMauBaoCaoDto>
              form={form}
              initialValues={{
                suDung: true,
                coLayGiaTri: true,
                dungChoDoanhNghiep: "DDI,FDI",
              }}
              layout="vertical"
              autoComplete="off"
            >
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Thứ tự"
                    name="thuTu"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Loại báo cáo"
                    name="loaiBaoCao"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <TDSelect
                      reload
                      showSearch
                      placeholder="Lựa chọn"
                      fetchOptions={async keyword => {
                        const res = await requestPOST<IPaginationResponse<any[]>>(`api/v1/loaibaocaos/search`, {
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
                            loaiBaoCaoId: current.value,
                          });
                        } else {
                          form.setFieldsValue({
                            loaiBaoCaoId: null,
                          });
                        }
                      }}
                    />

                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <Form.Item label="Kỳ báo cáo" name="kyBaoCao" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <TDSelect
                      reload
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
                  </Form.Item>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Tên"
                    name="ten"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Mã"
                    name="ma"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Doanh nghiệp sử dụng"
                    name="dungChoDoanhNghiep"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Checkbox.Group style={{ width: "100%" }}>
                      <Row>
                        <Col span={8}>
                          <Checkbox value="DDI">DDI</Checkbox>
                        </Col>
                        <Col span={8}>
                          <Checkbox value="FDI">FDI</Checkbox>
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mô tả/Căn cứ pháp lý" name="moTa">
                    <Input.TextArea rows={3} placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Đính kèm" name="dinhKem">
                    <Dragger
                      name="files"
                      multiple={false}
                      fileList={files}
                      accept=".xls, .xlsx"
                      action={`${API_URL}/api/v1/attachments/public`}
                      headers={{
                        Authorization: `Bearer ${token}`,
                      }}
                      onChange={(e) => setFiles(e.fileList)}
                    >
                      <p className="ant-upload-text">
                        Kéo thả tập tin hoặc nhấp chuột để tải lên
                      </p>
                      <p className="ant-upload-hint"></p>
                    </Dragger>
                  </FormItem>
                </div>
                <div className="col-xl-3 col-lg-3">
                  <FormItem name="suDung" valuePropName="checked">
                    <Checkbox>Sử dụng</Checkbox>
                  </FormItem>
                </div>
                <div className="col-xl-3 col-lg-3">
                  <FormItem name="coLayGiaTri" valuePropName="checked">
                    <Checkbox>Lấy dữ liệu từ biểu</Checkbox>
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <Button className="btn-sm btn-success rounded-1 py-2 px-5 ms-2" onClick={onFinish} disabled={buttonLoading}>
            <i className="fa fa-save me-2"></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 p-2 ms-2" onClick={handleCancel}>
            <i className="fa fa-times me-2"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export { ChiTietModal };
