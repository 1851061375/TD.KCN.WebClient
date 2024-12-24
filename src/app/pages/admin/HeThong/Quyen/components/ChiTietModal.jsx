import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';

import { Form, Input, Select, Spin, Checkbox, InputNumber } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useAuth } from '@/app/modules/auth';
import * as actionsModal from '@/redux/modal/Actions';
import { requestPOST, requestGET, requestPOST_NEW, requestPUT_NEW } from '@/utils/baseAPI';
import { removeAccents } from '@/utils/slug';

const FormItem = Form.Item;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm();

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  debugger
  const level = currentUser?.level
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/quyens/${id}`);

      if (res && res.data?.data) {
        form.setFieldsValue(res.data?.data);
      }
      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    dispatch(actionsModal.setModalVisible(false));
  };
  const getAvailableLevels = () => {
    debugger
    if (level === '3') return [3];
    if (level === '2') return [2, 3];
    if (level === '1') return [1, 2, 3];
    return [0, 1, 2, 3];
  };
  const onFinish = async () => {
    const values = await form.validateFields();
    setBtnLoading(true);
    try {
      const formData = form.getFieldsValue(true);
      if (id) {
        formData.id = id;
      }

      const res = id ? await requestPUT_NEW(`api/v1/quyens/${id}`, formData) : await requestPOST_NEW(`api/v1/quyens`, formData);

      if (res.status === 200) {
        toast.success('Cập nhật thành công!');
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
        //toast.error('Thất bại, vui lòng thử lại!');
        const errors = Object.values(res?.data?.errors ?? {});
        let final_arr = [];
        errors.forEach((item) => {
          final_arr = _.concat(final_arr, item);
        });
        toast.error('Thất bại, vui lòng thử lại! ' + final_arr.join(' '));
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
    setBtnLoading(false);
  };

  return (
    <Modal
      show={modalVisible}
      fullscreen={'lg-down'}
      size='xl'
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className='bg-primary px-4 py-3'>
        <Modal.Title className='text-white'>Chi tiết</Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={form} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
              <div className='row'>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Tên quyền' name='ten' rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input
                      placeholder=''
                    />
                  </FormItem>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Mã' name='ma' rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input
                      placeholder=''
                    />
                  </FormItem>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Section' name='section' rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input
                      placeholder=''
                    />
                  </FormItem>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Cấp độ'
                   name='level'
                    rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                    extra="Thành phố cấp 0, sở/quận/huyện cấp 1, xã/phường cấp 2, thôn/xóm cấp 3"
                    >
                    <Select placeholder='Chọn cấp'>
                      {getAvailableLevels().map((lvl) => (
                        <Option key={lvl} value={lvl}>
                          {lvl}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                </div>

              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-success rounded-1 py-2 px-5  ms-2' onClick={onFinish} disabled={btnLoading}>
            <i className='fa fa-save'></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-secondary rounded-1 p-2  ms-2' onClick={handleCancel}>
            <i className='fa fa-times'></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
