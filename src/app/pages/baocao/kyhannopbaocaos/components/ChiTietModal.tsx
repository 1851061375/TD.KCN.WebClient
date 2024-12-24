import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input, Spin, Checkbox, InputNumber, Select, DatePicker } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { RootState, AppDispatch } from '@/redux/Store';
import { toast } from 'react-toastify';
import _ from 'lodash';

import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { requestGET, requestPOST, requestPUT } from '@/utils/baseAPI';
import { IKyBaoCaoDto, IKyHanNopBaoCaoDto, IPaginationResponse, IResult, ISoKyBaoCaoDto } from '@/models';
import { removeAccents } from '@/utils/utils';
import { TDSelect } from '@/app/components';
import { DefaultOptionType } from 'antd/es/select';
import viVN from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';

const FormItem = Form.Item;

const ModalItem = props => {
  const dispatch: AppDispatch = useDispatch();

  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IKyHanNopBaoCaoDto | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm<IKyHanNopBaoCaoDto>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [kyBaoCaoId, setKyBaoCaoId] = useState<string | null>(null);
  const [soKyBaoCaos, setSoKyBaoCaos] = useState<ISoKyBaoCaoDto[]>([]);


  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IKyHanNopBaoCaoDto>>(`api/v1/kyhannopbaocaos/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data) {

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
          _data.bieuMauBaoCao = _data?.bieuMauBaoCaoId
            ? {
              value: _data?.bieuMauBaoCaoId ?? null,
              label: _data?.bieuMauBaoCaoTen ?? null,
            } : null;

          var kyHanNops = _data.kyHanNop.toString().split("/");
          if (Array.isArray(kyHanNops) && kyHanNops.length > 1) {
            _data.kyHanNop = dayjs(`${kyHanNops[0]}/${kyHanNops[1]}`, "DD/MM");
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await requestPOST<IPaginationResponse<ISoKyBaoCaoDto[]>>(`api/v1/sokybaocaos/search`, {
        advancedSearch: {
          fields: ["ten"],
          keyword: null,
        },
        pageNumber: 1,
        pageSize: 1000,
        kyBaoCaoId: kyBaoCaoId,
      });
      if (response.data) {
        const { data } = response.data;
        setSoKyBaoCaos(data ?? []);
      }
    };
    fetchData();
  }, [kyBaoCaoId]);


  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const formData: IKyHanNopBaoCaoDto = {
        ...values,
        kyHanNop: values.kyHanNop.format("DD/MM"),
        ...(id && { id }),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/kyhannopbaocaos/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/kyhannopbaocaos`, formData);

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
            <Form<IKyHanNopBaoCaoDto> form={form} initialValues={{ suDung: true }} layout="vertical" autoComplete="off">
              <div className="row">
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
                        setKyBaoCaoId(value ? current?.id : null);
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
                      // filterOption={(input, option) =>
                      //   (option?.label ?? "")
                      //     .toLowerCase()
                      //     .includes(input.toLowerCase())
                      // }
                      onChange={(value, current: any) => {
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
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Hạn nộp báo cáo"
                    name="kyHanNop"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <DatePicker
                      locale={viVN}
                      format="DD/MM"
                      placeholder="DD/MM"
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Nộp trước hạn "
                    name="nopTruocHan"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      placeholder="Giá trị"
                      formatter={(value) =>
                        value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                      }
                      // parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, "") : "")}
                      style={{ width: "100%" }}
                      addonAfter="Ngày"
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Mẫu báo cáo"
                    name="bieuMauBaoCao"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <TDSelect
                      reload
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
                  <FormItem label=" " name="suDung" valuePropName="checked">
                    <Checkbox>Sử dụng</Checkbox>
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

export default ModalItem;
