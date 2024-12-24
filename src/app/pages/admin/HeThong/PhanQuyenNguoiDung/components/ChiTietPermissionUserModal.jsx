import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import { useAuth } from '@/app/modules/auth';
import {Form, Input, Select, Spin, Checkbox} from 'antd';
import {Modal, Button, Tabs, Tab} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {requestPOST, requestGET, requestPUT} from '@/utils/baseAPI';
import _ from 'lodash';
import * as actionsModal from '@/redux/modal/Actions';

const FormItem = Form.Item;

const {TextArea} = Input;

const ModalItem = (props) => {
  const { currentUser } = useAuth();
  const {userHandle, handleCancel, modalVisible} = props;
  const dispatch = useDispatch();
  const [dataVaiTro, setDataVaiTro] = useState([]);
  const [dataQuyen, setDataQuyen] = useState([]);
  const [dataQuyenVaiTro, setDataQuyenVaiTro] = useState([]);
  const [valueVaiTro, setValueVaiTro] = useState([]);
  const [fillerQuyenVaiTro, setFillerQuyenVaiTro] = useState([]);
  const [formVaiTro] = Form.useForm();
  const [formQuyen] = Form.useForm();
  const [loadding, setLoadding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/users/${userHandle?.userName}/permissions`);
debugger
      if (res) {
        formQuyen.setFieldsValue(res.data);
        formVaiTro.setFieldsValue({vaiTros: res.data?.roles});
      }
      setLoadding(false);
    };

    fetchData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // call api vai tro
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestPOST(
        `api/v1/vaitros/search`,
        _.assign({
          advancedSearch: {},
        })
      );
      if (res) {
        setDataVaiTro(res?.data?.data);
      }
      setLoadding(false);
    };

    fetchData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //call api  quyen
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestPOST(
        `api/v1/quyens/search`,
        _.assign({
          advancedSearch: {},
          orderBy: ['createdOn DESC'],
          level: currentUser?.level
        })
      );
      if (res) {
        const groupPermission = groupPermissions(res?.data?.data);
        setDataQuyen(groupPermission);
      }
      setLoadding(false);
    };

    fetchData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //call api quyenvaitro
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestPOST(
        `api/v1/quyenvaitros/search`,
        _.assign({
          advancedSearch: {},
        })
      );
      console.log(res);
      if (res) {
        setDataQuyenVaiTro(res?.data?.data);
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

  const onChange = (checkedValues) => {
    if (checkedValues.target.checked) {
      if (!valueVaiTro.some((value) => value === checkedValues.target.value)) {
        setValueVaiTro([...valueVaiTro, checkedValues.target.value]);
      }
    } else {
      setValueVaiTro(valueVaiTro.filter((value) => value !== checkedValues.target.value));
    }
  };

  useEffect(() => {
    const filteredData = dataQuyenVaiTro.filter((item) => valueVaiTro.includes(item.vaiTroId));
    setFillerQuyenVaiTro(filteredData);
  }, [valueVaiTro]);
  const selectedValues = Array.from(new Set(fillerQuyenVaiTro.map((item) => item.quyen.ma)));

  useEffect(() => {
    formQuyen.setFieldsValue({permissions: selectedValues});
  }, [fillerQuyenVaiTro]);
  const onFinish = async () => {
    const values = await formQuyen.validateFields();

    try {
      const formDataQuyen = formQuyen.getFieldsValue(true);
      const formDataVaiTro = formVaiTro.getFieldsValue(true);

      /* if (id) {
        formDataQuyen.id = id;
      } */
      const resVaiTro = await requestPUT(`api/users/${userHandle?.userName}/update-vai-tro`, {
        ...formDataVaiTro,
        userName: userHandle?.userName,
      });
      const resPermissions = await requestPUT(`api/users/${userHandle?.userName}/permissions`, {
        ...formDataQuyen,
        userName: userHandle?.userName,
      });
      if (resPermissions) {
        toast.success('Cập nhật thành công!');
        dispatch(actionsModal.setRandomUsers());
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
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Tabs defaultActiveKey='vaiTro' id='uncontrolled-tab-example' className='mb-3'>
              <Tab eventKey='vaiTro' title='Vai trò'>
                <Form form={formVaiTro} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
                  <div className='row'>
                    <Form.Item name='vaiTros' className='mb-0'>
                      <Checkbox.Group style={{width: '100%'}}>
                        <table className='table align-middle table-row-dashed fs-6 gy-5'>
                          <tbody className='text-gray-600 fw-bold'>
                            {dataVaiTro.map((vaiTro) => (
                              <tr>
                                <td className='text-gray-800'>{vaiTro.ten}</td>
                                <td>
                                  <div className='d-flex'>
                                    <Checkbox value={vaiTro.id} onChange={onChange}></Checkbox>
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
              </Tab>
              <Tab eventKey='Quyen' title='Quyền'>
                <Form form={formQuyen} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
                  <Form.Item name='permissions'>
                    <Checkbox.Group>
                      {' '}
                      <div className='row'>
                        {dataQuyen.map((group) => (
                          <div className='mb-3'>
                            <p className='fw-bold'>{group.section}</p>
                            <div className='row'>
                              {group.items.map((quyen) => (
                                <div className='col-3 mb-1'>
                                  <div className='d-flex align-items-center'>
                                    <Checkbox value={quyen.ma}> {quyen.name}</Checkbox>
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
              </Tab>
            </Tabs>
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
