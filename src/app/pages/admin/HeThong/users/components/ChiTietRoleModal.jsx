import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {Form, Input, Select, Spin, Checkbox} from 'antd';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';

import * as actionsModal from '@/redux/modal/Actions';
import {requestPOST, requestGET, requestPUT} from '@/utils/baseAPI';

const FormItem = Form.Item;

const {TextArea} = Input;

const ModalItem = (props) => {
  const {userHandle, handleCancel, modalVisible} = props;
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [dataModal, setDataModal] = useState([]);
  const [data, setData] = useState([]);

  const [loadding, setLoadding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`users/${userHandle?.userName}/roles`);

      if (res) {
        console.log(res);
        setDataModal(res);
        setData(res);
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

  const handleItem = (e) => {
    /* console.log(e.target.name);
      console.log(e.target.checked); */

    dataModal.map((i) => {
      if (i.roleId == e.target.name) {
        i.enabled = e.target.checked;
      }
      return i;
    });
    setDataModal(dataModal);
  };
  const onFinish = async () => {
    try {
      const formData = form.getFieldsValue(true);

      const resPermissions = await requestPOST(`users/${userHandle?.userName}/roles`, {userRoles: dataModal});
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
        <Modal.Title className='text-white'>Danh sách nhóm của người dùng</Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={form} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
              <div className='row'>
                <Form.Item name='permissions' className='card-body border-top px-9 py-9'>
                  {dataModal.map((item) => {
                    return (
                      <div key={Math.random().toString()}>
                        <label className='form-check form-check-custom form-check-solid align-items-start'>
                          <input
                            className='form-check-input me-3'
                            type='checkbox'
                            name={`${item.roleId}`}
                            defaultChecked={item?.enabled ?? false}
                            onChange={(e) => {
                              handleItem(e);
                            }}
                          />
                          <span className='form-check-label d-flex flex-column align-items-start'>
                            <span className='fw-bolder fs-5 mb-0'>{item?.roleName ?? ''}</span>
                            <span className='text-muted fs-6'>{item?.description ?? ''}</span>
                          </span>
                        </label>
                        <div className='separator separator-dashed my-6' />
                      </div>
                    );
                  })}
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
