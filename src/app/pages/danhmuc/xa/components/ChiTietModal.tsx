import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Checkbox, Form, Input, InputNumber, Spin } from 'antd';
import { Modal, Button } from 'react-bootstrap';

import * as actionsModal from '@/redux/modal/Actions';
import { RootState, AppDispatch } from '@/redux/Store';
import { IDiaBan } from '@/models/DiaBan';
import {  IResult } from '@/models';
import { removeAccents } from '@/utils/utils';
import { requestGET, requestPOST } from '@/utils/baseAPI';
import { requestPUT } from '@/utils/baseAPI';
import * as actionsGlobal from '@/redux/global/Actions';

const FormItem = Form.Item;

const ModalItem = props => {
  const dispatch: AppDispatch = useDispatch();

  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IDiaBan | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm<IDiaBan>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IDiaBan>>(`api/v1/diabans/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data) {
          form.setFieldsValue(_data);
        }
      } catch (error) {
        console.error('Error fetching organization unit:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
    return () => {};
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
      const formData: IDiaBan = {
        ...values,
        ...(id && { id }),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/diabans/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/diabans`, formData);

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
            <Form<IDiaBan> form={form} layout="vertical" /* initialValues={initData} */ autoComplete="off">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tên" name="ten" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mã" name="ma" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mức độ ưu tiên" name="cap">
                    <InputNumber placeholder="" min={0} max={1000} style={{ width: '100%' }} />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label=" " name="isActive" valuePropName="checked">
                    <Checkbox>Hoạt động</Checkbox>
                  </FormItem>
                </div>
                {/* <div className="col-xl-12 col-lg-12">
                  <FormItem label="Ghi chú" name="moTa">
                    <Input.TextArea rows={4} placeholder="" />
                  </FormItem>
                </div> */}
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-primary rounded-1 p-2  ms-2" onClick={onFinish} disabled={buttonLoading}>
            <i className="fa fa-save"></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 p-2  ms-2" onClick={handleCancel} disabled={buttonLoading}>
            <i className="fa fa-times"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
