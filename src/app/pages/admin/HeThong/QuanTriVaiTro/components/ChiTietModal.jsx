import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { Form, Input, Select, Spin, Checkbox, InputNumber, DatePicker } from 'antd';
import { Modal, Button, Tabs, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import _ from 'lodash';
import * as actionsModal from '@/redux/modal/Actions';
import { requestPOST, requestGET, requestPUT } from '@/utils/baseAPI';

const FormItem = Form.Item;

const ModalItem = (props) => {
  const dispatch = useDispatch();

  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;
  const mode = dataModal?.mode ?? 'edit';
  const [form] = Form.useForm();
  const [formVaiTro] = Form.useForm();
  const [formQuyen] = Form.useForm();
  const [dataQuyen, setDataQuyen] = useState([]);
  const [dataQuyenVaiTro, setDataQuyenVaiTro] = useState([]);
  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/vaitros/${id}`);

      if (res && res.data) {
        formVaiTro.setFieldsValue(res.data.data);
      }
      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestPOST(
        `api/v1/quyens/search`,
        _.assign({
          advancedSearch: {},
          orderBy: ['createdOn ASC'],
        })
      );

      if (res && res.data) {
        const groupPermission = groupPermissions(res.data.data);
        setDataQuyen(groupPermission);
      }
      setLoadding(false);
    };

    fetchData();

    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestPOST(
        `api/v1/quyenvaitros/search`,
        _.assign({
          advancedSearch: {},
          vaiTroId: id,
        })
      );
      if (res&&(mode === 'view'||mode === 'edit')) {
        setDataQuyenVaiTro(res.data.data);
      }
      setLoadding(false);
    };

    fetchData();
  }, []);
  const groupPermissions = (arr) => {
    const result = [];
    const group = _.groupBy(arr, 'section');
    for (const section in group) {
      result.push({
        section,
        items: group[section],
      });
    }
    return result;
  };

  const selectedValues = Array.from(new Set(dataQuyenVaiTro.map((item) => item.quyen.id)));
  formQuyen.setFieldsValue({ permissions: selectedValues });

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    try {
      const valuesVaiTro = await form.validateFields();
      const formDataVaiTro = formVaiTro.getFieldsValue(true);
      const formDataQuyen = formQuyen.getFieldsValue(true);

      setBtnLoading(true);

      const ten = formDataVaiTro.ten;
      const ma = formDataVaiTro.ma;
      const permissions = formDataQuyen.permissions.join(',');

      const payload = {
        vaiTroId: id,
        ten: ten,
        ma: ma,
        quyenId: permissions,
      };

      const res = id
      ? await requestPUT(`api/v1/quyenvaitros/${id}`, payload)
      : await requestPOST(`api/v1/quyenvaitros`, payload);
      if (res?.data.succeeded) {
        toast.success('Cập nhật thành công!');
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
        const errors = Object.values(res?.data?.data?.errors ?? {});
        let final_arr = [];
        errors.forEach((item) => {
          final_arr = _.concat(final_arr, item);
        });
        toast.error('Thất bại, vui lòng thử lại! ' + final_arr.join(' '));
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    } finally {
      setBtnLoading(false);
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
        <Modal.Title className='text-white'>
          {id
            ? (mode === 'view' ? 'Xem nhóm người dùng' : mode === 'edit' ? 'Sửa nhóm người dùng' : '')
            : 'Thêm nhóm người dùng'}
        </Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={formVaiTro} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
              <div className='row'>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Tên' name='ten' rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder='' disabled={mode === 'view'} />
                  </FormItem>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Mã' name={`ma`} required='Không được để trống'>
                    <Input placeholder='' disabled={mode === 'view'} />
                  </FormItem>
                </div>
              </div>
              {/* <div className='col-xl-12 col-lg-12'>
                <h4 className='pb-4 text-danger'>Danh sách quyền</h4>
                <div className='card card-xl-stretch'>
                  <Spin spinning={loadding}>
                    {!loadding && (
                      <Form form={formQuyen} layout='vertical'  autoComplete='off'>
                        <Form.Item name='permissions'>
                          <Checkbox.Group>
                            {' '}
                            <div className='row' style={{ marginLeft: '20px' }}>
                              {dataQuyen.map((group) => (
                                <div className='mb-3'>
                                  <p className='fw-bold'>{group.section}</p>
                                  <div className='row'>

                                    {group.items.map((quyen) => (
                                      <div className='col-3 mb-1'>
                                        <div className='d-flex align-items-center'>
                                          <Checkbox value={quyen.id} disabled={mode === 'view'}> {quyen.name}</Checkbox>
                                          <span className='text-gray-800 ms-2'>{quyen.ten}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Checkbox.Group>
                        </Form.Item>
                      </Form>
                    )}
                  </Spin>
                </div>
              </div> */}
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          {(mode === 'edit'||mode==='add' )&& (
            <Button className='btn-sm btn-success rounded-1 py-2 px-5  ms-2' onClick={onFinish} disabled={btnLoading}>
              <i className='fa fa-save'></i>
              {id ? 'Lưu' : 'Tạo mới'}
            </Button>
          )}
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
