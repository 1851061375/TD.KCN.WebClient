import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {Form, Checkbox, Input} from 'antd';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';

const FormItem = Form.Item;

const ModalItem = (props) => {
  const {modalVisible, onCancel, onFinish} = props;

  const initData = {
    url: 'https://api.bacgiang.gov.vn/danhmuc/GetAllUser?top=100000',
    token: '83d4c566-9fb6-3da8-a496-d688d3f1694b',
  };

  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const dongY = async () => {
    const values = await form.validateFields();

    const formData = form.getFieldsValue(true);

    form.resetFields();

    onFinish(formData);
  };

  return (
    <Modal show={modalVisible} onExited={handleCancel} keyboard={true} scrollable={true} onEscapeKeyDown={handleCancel}>
      <Modal.Header className='bg-primary px-4 py-3'>
        <Modal.Title className='text-white'>Cấu hình đồng bộ</Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Form form={form} layout='vertical' initialValues={initData} autoComplete='off'>
          <div className='row'>
            <div className='col-xl-12 col-lg-12'>
              <FormItem label='URL Web nguồn' name='url' rules={[{required: true, message: 'Không được để trống!'}]}>
                <Input placeholder='' />
              </FormItem>
            </div>
            <div className='col-xl-12 col-lg-12'>
              <FormItem label='Bearer Token' name='token' rules={[{required: true, message: 'Không được để trống!'}]}>
                <Input placeholder='' />
              </FormItem>
            </div>
          </div>
          <div className='row pt-8'>
            <div className='col-xl-12 col-lg-12'>
              Lưu ý: URL Web nguồn và Token được khai báo trên hệ thống apimanager.bacgiang.gov.vn, nếu không có gì thay đổi, vui lòng sử dụng giá trị
              mặc định để đồng bộ. Dữ liệu trùng sẽ được thay thế bằng dữ liệu đồng bộ
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-primary rounded-1 p-2  ms-2' onClick={dongY}>
            <i className='fa fa-save'></i>
            {'Đồng bộ cơ cấu'}
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
