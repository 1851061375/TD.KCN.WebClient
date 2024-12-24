/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { useAuth } from '@/app/modules/auth';
import { Menu, Dropdown, Input, Form, Popconfirm } from 'antd';
import clsx from 'clsx';

import * as actionsModal from '@/redux/modal/Actions';
import { toAbsoluteUrl } from '@/utils/AssetHelpers';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import TableList from '@/app/components/TableList';
import ModalItem from './ChiTietUserModal';
import { requestDELETE, requestPOST } from '@/utils/baseAPI';
import PageHeader from './PageHeader';

import ChiTietPermissionModal from './ChiTietPermissionUserModal';
import ChiTietRoleModal from './ChiTietRoleModal';

const FormItem = Form.Item;

const UsersList = (props) => {
  // const API_URL_FILE = process.env.REACT_APP_API_URL_FILE + '/documentattachments/';
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const [form] = Form.useForm();
  const random = useSelector((state) => state.modal.random);
  const {dataSearch} = props;
  const [dataTable, setDataTable] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(1);
  //const [dataSearch, setDataSearch] = useState(null);

  const [modalKhoiPhucMKVisible, setModalKhoiPhucMKVisible] = useState(false);
  const [modalChuyenNhom, setModalChuyenNhom] = useState(false);
  const [modalCapQuyen, setModalCapQuyen] = useState(false);
  const { currentUser } = useAuth();
  const [userHandle, setUserHandle] = useState(null);

  const handleCancel = () => {
    setModalKhoiPhucMKVisible(false);
    setModalChuyenNhom(false);
    setModalCapQuyen(false);
    setUserHandle(null);
  };

  const handleKhoiPhucMatKhau = (item) => {
    setUserHandle(item);
    form.resetFields();
    setModalKhoiPhucMKVisible(true);
  };

  const handleChuyenNhom = (item) => {
    setUserHandle(item);
    form.resetFields();
    setModalChuyenNhom(true);
  };

  const handleCapQuyen = (item) => {
    setUserHandle(item);
    form.resetFields();
    setModalCapQuyen(true);
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    let formData = form.getFieldsValue(true);
    formData.userName = userHandle?.userName ?? '';

    //console.log(formData);
    if (!formData.password || !formData.confirmPassword || formData.password != formData.confirmPassword) {
      toast.error('Thất bại, vui lòng nhập lại mật khẩu!');
      return;
    }
    var res = await requestPOST(`api/users/admin-reset-password`, formData);

    toast.success('Cập nhật thành công!');
    handleCancel();
  };

  useEffect(() => {
    setDataTable([]);
    setOffset(1);
    setSize(10);
    return () => { };
  }, [dataSearch, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/users/search`,
          _.assign(
            {
              advancedSearch: {
                fields: ['fullName', 'userName', 'email'],
                keyword: dataSearch?.keywordSearch ?? null,
              },
              organizationUnitId:currentUser?.organizationUnitId,
              keyword: dataSearch?.keywordSearch ?? null,
              pageNumber: offset,
              pageSize: size,
              orderBy: ['fullName'],
            },
            dataSearch
          )
        );
        console.log(res.data);
        setDataTable(res.data?.data ?? []);
        setCount(res?.data?.totalCount ?? 0);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    //console.log('vaoday', offset, size, random, dataSearch);

    if (!loading) {
      fetchData();
    }

    return () => { };
  }, [offset, size, random, dataSearch]);

  /* useEffect(() => {
    setUpdate(true);
    return () => {};
  }, [offset, size, inputValue]); */

  const handleButton = async (type, item) => {
    switch (type) {
      case 'chi-tiet':
        dispatch(actionsModal.setDataModal({ ...item, readOnly: false }));
        dispatch(actionsModal.setModalVisible(true));

        break;

      case 'xem':
        dispatch(actionsModal.setDataModal({ ...item, readOnly: true }));
        dispatch(actionsModal.setModalVisible(true));

        break;

      case 'cap-lai-mat-khau':
        handleKhoiPhucMatKhau(item);
        //setEditVanBan(true);
        break;
      case 'verifi-user':
        var res_kichhoat = await requestPOST(`api/users/${item.userId}/toggle-verified`, {
          activateUser: item.isVerified ? false : true,
          userId: item.userId,
        });

        toast.success('Thao tác thành công!');
        dispatch(actionsModal.setRandom());

        break;
      case 'toggle-status':
        var res_kichhoat = await requestPOST(`api/sers/${item.userId}/toggle-status`, {
          activateUser: !item.isActive,
          userId: item.userId,
        });

        toast.success('Thao tác thành công!');
        dispatch(actionsModal.setRandom());

        break;
      case 'xoa-tai-khoan':
        var res = await requestDELETE(`api/users/${item.userName}`);
        if (res) {
          toast.success('Thao tác thành công!');
          dispatch(actionsModal.setRandom());
        } else {
          toast.error('Thất bại, vui lòng thử lại!');
        }
        break;

      case 'chuyen-nhom':
        handleChuyenNhom(item);
        //setEditVanBan(true);
        break;

      case 'cap-quyen':
        handleCapQuyen(item);
        //setEditVanBan(true);
        break;

      default:
        break;
    }
  };

  const columns = [
    {
      title: 'Tài khoản',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record, index) => {
        return (
          <>
            <div className='d-flex align-items-center'>
              {/* begin:: Avatar */}
              {/* <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
                <a href='#'>
                  {record.imageUrl ? (
                    <div className='symbol-label'>
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        'symbol-label fs-3',
                        `bg-light-${record.isVerified ? 'danger' : ''}`,
                        `text-${record.isVerified ? 'danger' : ''}`
                      )}
                    ></div>
                  )}
                </a>
              </div> */}
              <div className='d-flex flex-column'>
                <a href='#' className='text-gray-800 text-hover-primary mb-1 fw-bolder'>
                  {record.fullName}
                </a>
                <span>{record.email}</span>
              </div>
            </div>
          </>
        );
      },
    },
    {
      width: '15%',
      title: 'Tên đăng nhập',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      width: '15%',
      title: 'Đơn vị',
      dataIndex: '',
      key: '',
      render: (text, record, index) => {
        return record?.donVi?.name;
      },
    },
    {
      width: '15%',
      title: 'Chức vụ',
      dataIndex: '',
      key: '',
      render: (text, record, index) => {
        return record?.chucVu?.tenChucVu;
      },
    },
    {
      width: '10%',
      title: 'Trạng thái',
      render: (text, record, index) => {
        return (
          <>
            <div className={clsx('badge fw-bolder', `badge-light-${record.isActive ? 'success' : 'danger'}`)}>
              {record.isActive ? 'Đang hoạt động' : 'Bị khoá'}
            </div>
          </>
        );
      },
      key: 'isActive',
    },
    {
      title: 'Thao tác',
      className: 'text-center',
      dataIndex: '',
      key: '',
      width: '5%',
      render: (text, record) => {
        return (
          <div>
            <a
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1'
              data-toggle='m-tooltip'
              title='Cấp quyền'
              onClick={() => {
                handleButton(`cap-quyen`, record);
              }}
            >
              <i className='fa fa-certificate'></i>
            </a>
            
          </div>
        );
      },
    },
  ];
  return (
    <>
      <PageHeader title={props?.title ?? ''} sendDataSearch={(val) => setDataSearch(val)} />

      <div className='card-body card-dashboard px-3 py-3'>
        <div className='card-dashboard-body table-responsive'>
          <TableList
            dataTable={dataTable}
            columns={columns}
            isPagination={true}
            size={size}
            count={count}
            setOffset={setOffset}
            offset={offset}
            setSize={setSize}
            loading={loading}
          />
        </div>
      </div>
      {modalVisible ? <ModalItem setUpdate={setUpdate} update={update} /> : <></>}
      {modalCapQuyen ? <ChiTietPermissionModal modalVisible={modalCapQuyen} userHandle={userHandle} handleCancel={handleCancel} /> : <></>}
      {modalChuyenNhom ? <ChiTietRoleModal modalVisible={modalChuyenNhom} userHandle={userHandle} handleCancel={handleCancel} /> : <></>}

      {modalKhoiPhucMKVisible ? (
        <Modal show={modalKhoiPhucMKVisible} onExited={handleCancel} keyboard={true} scrollable={true} onEscapeKeyDown={handleCancel}>
          <Modal.Header className='bg-primary px-4 py-3'>
            <Modal.Title className='text-white'>Khôi phục mật khẩu</Modal.Title>
            <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
          </Modal.Header>
          <Modal.Body>
            <Form form={form} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
              <div className='row'>
                <div className='col-xl-12 col-lg-12'>
                  <FormItem
                    label='Mật khẩu mới'
                    name='password'
                    rules={[
                      { required: true, message: 'Không được để trống!' },
                      {
                        pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                        message: 'Mật khẩu từ 6-18 ký tự, gồm có: chữ hoa hoặc chữ thường hoặc số và các ký tự đặc biệt! Vui lòng kiểm tra lại!',
                      },
                    ]}
                  >
                    <Input placeholder='' type={'password'} />
                  </FormItem>
                </div>
                <div className='col-xl-12 col-lg-12'>
                  <FormItem
                    label='Nhập lại mật khẩu mới'
                    name='confirmPassword'
                    rules={[
                      { required: true, message: 'Không được để trống!' },
                      {
                        pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                        message: 'Mật khẩu từ 6-18 ký tự, gồm có: chữ hoa hoặc chữ thường và các ký tự đặc biệt! Vui lòng kiểm tra lại!',
                      },
                    ]}
                  >
                    <Input placeholder='' type={'password'} />
                  </FormItem>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
            <div className='d-flex justify-content-center  align-items-center'>
              <Button className='btn-sm btn-primary rounded-1 p-2  ms-2' onClick={onFinish}>
                <i className='fa fa-save'></i>
                {'Đổi mật khẩu'}
              </Button>
            </div>
            <div className='d-flex justify-content-center  align-items-center'>
              <Button className='btn-sm btn-secondary rounded-1 p-2  ms-2' onClick={handleCancel}>
                <i className='fa fa-times'></i>Huỷ
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
