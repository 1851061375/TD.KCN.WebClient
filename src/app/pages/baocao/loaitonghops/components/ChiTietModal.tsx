import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input, Spin, Checkbox, InputNumber } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { RootState, AppDispatch } from '@/redux/Store';
import { toast } from 'react-toastify';
import _ from 'lodash';

import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { API_URL, FILE_URL, requestGET, requestPOST, requestPUT } from '@/utils/baseAPI';
import { ILoaiTongHopDto, IPaginationResponse, IResult } from '@/models';
import { removeAccents } from '@/utils/utils';
import { TDSelect } from '@/app/components';
import Dragger from 'antd/es/upload/Dragger';
import { getAuth } from '@/app/modules/auth';

const FormItem = Form.Item;

const ModalItem = props => {
  const dispatch: AppDispatch = useDispatch();

  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as ILoaiTongHopDto | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm<ILoaiTongHopDto>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [dinhKem, setDinhKem] = useState<any[]>([]);
  const token = getAuth()?.token;


  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<ILoaiTongHopDto>>(`api/v1/loaitonghops/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data) {
          if (_data?.dinhKem) {
            setDinhKem(_data?.dinhKem?.split(',').map((item, index) => ({
              uid: index,
              name: item.substring(item.lastIndexOf("/") + 1),
              status: 'done',
              url: FILE_URL + item,
            })) ?? []);
          }
          _data.loaiBaoCao = _data.loaiBaoCaoId ? { label: _data.loaiBaoCaoTen, value: _data.loaiBaoCaoId } : null;
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

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const formData: ILoaiTongHopDto = {
        ...values,
        dinhKem: dinhKem.length > 0
          ? dinhKem[0]?.response?.data[0]?.url ?? dinhKem[0].path
          : null,
        ...(id && { id }),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/loaitonghops/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/loaitonghops`, formData);

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
            <Form<ILoaiTongHopDto> form={form} initialValues={{ suDung: true }} layout="vertical" autoComplete="off">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thứ tự" name="thuTu" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <InputNumber placeholder="" min={0} max={1000} style={{ width: '100%' }} />
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
                  <FormItem label="Tên" name="ten" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input
                      placeholder=""
                      onInput={async e => {
                        form.setFieldValue('ma', removeAccents((e.target as HTMLInputElement).value));
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mã" name="ma" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>


                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Ghi chú" name="moTa">
                    <Input.TextArea rows={3} placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Đính kèm" name="dinhKem">
                    <Dragger
                      name="files"
                      multiple={false}
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
                    </Dragger>
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
