import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {Form, Input, Select, Spin, Checkbox} from 'antd';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';

import * as actionsModal from '@/redux/modal/Actions';
import {requestPOST, requestGET, requestPUT} from '@/utils/baseAPI';

import {permissions} from '@/utils/permissions';

const ModalItem = (props) => {
  const {userHandle, handleCancel, modalVisible} = props;
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [loadding, setLoadding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`appusers/${userHandle?.userName}/permissions`);

      if (res) {
        form.setFieldsValue(res);
      }
      setLoadding(false);
    };

    fetchData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancell = () => {
    form.resetFields();
    handleCancel();
  };

  const onFinish = async () => {
    const values = await form.validateFields();

    try {
      const formData = form.getFieldsValue(true);
      /* if (id) {
        formData.id = id;
      } */

      const resPermissions = await requestPUT(
        `appusers/${userHandle?.userName}/permissions`,
        formData
      );
      if (resPermissions) {
        toast.success('Cập nhật thành công!');
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
        toast.error('Thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
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
        <Modal.Title className='text-white'>Danh sách quyền</Modal.Title>
        <button
          type='button'
          className='btn-close btn-close-white'
          aria-label='Close'
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={form} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
              <div className='row'>
                <Form.Item name='permissions' className='mb-0'>
                  <Checkbox.Group style={{width: '100%'}}>
                    <table className='table align-middle table-row-dashed fs-6 gy-5'>
                      <tbody className='text-gray-600 fw-bold'>
                        {permissions.map((i) => (
                          <tr key={i.value}>
                            <td className='text-gray-800'>{i.name}</td>
                            <td>
                              <div className='d-flex'>
                                <Checkbox value={i.value}></Checkbox>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/*end::Table body*/}
                    </table>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-success rounded-1 p-2  ms-2' onClick={onFinish}>
            <i className='fa fa-save'></i>
            {'Lưu'}
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
