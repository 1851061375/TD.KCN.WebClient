/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Menu, Dropdown, Input, Form, Popconfirm, Table, Modal as ModalAntd } from 'antd';

import clsx from 'clsx';

import * as actionsModal from '@/redux/modal/Actions';
//import {toAbsoluteUrl} from 'src/utils/AssetHelpers';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import ModalItem from './ChiTietModalUser';
import { requestDELETE, requestPOST, requestPUT } from '@/utils/baseAPI';
import ChiTietPermissionModal from './ChiTietPermissionUserModal';
import ChiTietModalAddUser from './ChiTietModalAddUser';
import ChiTietModalChuyenUser from './ChiTietModalChuyenUser';

const FormItem = Form.Item;

const UsersList = () => {
  const dispatch = useDispatch();
  debugger
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const dataModal = useSelector((state) => state.modal.currentOrganizationUnit);
  const id = dataModal?.id ?? null;
  const level = dataModal?.level;
  const [keySearch, setKeySearch] = useState('');

  const [form] = Form.useForm();
  const random = useSelector((state) => state.modal.randomUsers);

  const [dataTable, setDataTable] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalKhoiPhucMKVisible, setModalKhoiPhucMKVisible] = useState(false);
  const [userHandle, setUserHandle] = useState(null);
  const [modalCapQuyen, setModalCapQuyen] = useState(false);

  const [modalAddUser, setModalAddUser] = useState(false);
  const [modalChuyenUser, setModalChuyenUser] = useState(null);
  const colors = [
    'primary', 'success', 'info', 'warning', 'danger',
    'secondary', 'light', 'dark',
  ];
  const url = 'https://minioapi.hanhchinhcong.net/';

  const handleCancel = () => {
    setModalKhoiPhucMKVisible(false);
    setModalCapQuyen(false);
    setUserHandle(null);
  };

  const handleCancelAddUser = () => {
    setModalAddUser(false);
    setModalChuyenUser(null);
  };

  const handleKhoiPhucMatKhau = (item) => {
    setUserHandle(item);
    form.resetFields();
    setModalKhoiPhucMKVisible(true);
  };

  const getRandomColor = (name) => {
    if (!name) return 'secondary';
    const firstLetter = name[0].toUpperCase();
    const alphabetIndex = firstLetter.charCodeAt(0) - 65;
    const colorIndex = (alphabetIndex >= 0 && alphabetIndex < colors.length)
      ? alphabetIndex % colors.length
      : 0;
    return colors[colorIndex];
  };
  const onFinish = async () => {
    const values = await form.validateFields();

    let formData = form.getFieldsValue(true);
    formData.userName = userHandle?.userName ?? '';

    if (!formData.password || !formData.confirmPassword || formData.password != formData.confirmPassword) {
      toast.error('Thất bại, vui lòng nhập lại mật khẩu, mật khẩu mới và nhập lại mật khẩu không trùng nhau!');
      return;
    }
    var res = await requestPOST(`api/users/admin-reset-password`, formData);
    if (res.data?.message === "Password reset successfully.")
      toast.success('Cập nhật thành công!');
    else toast.error(res.data?.message)
    handleCancel();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(`api/v1/cocautochucnguoidungs/search`, {
          pageNumber: 1,
          pageSize: 1000,
          coCauToChucId: id,
        });
        setDataTable(res.data?.data ?? []);
        setLoading(false);
        setUpdate(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      setDataTable([]);
    };
  }, [random, id]);

  /* useEffect(() => {
    setUpdate(true);
    return () => {};
  }, [offset, size, inputValue]); */
  const handleCapQuyen = (item) => {
    setUserHandle(item);
    form.resetFields();
    setModalCapQuyen(true);
  };

  const addUserToNhom = async (dataUser) => {
    handleCancelAddUser();

    const res = await requestPOST(`api/v1/cocautochucnguoidungs`, {
      coCauToChucId: dataModal.id,
      userName: dataUser.userName,
    });
    if (res) {
      toast.success('Cập nhật thành công!');
      dispatch(actionsModal.setRandomUsers());
      handleCancel();
    } else {
      toast.error('Thất bại, vui lòng thử lại!');
    }
  };

  const chuyenUserToNhom = async (dataUser) => {
    handleCancelAddUser();

    const res = await requestPUT(`api/v1/cocautochucnguoidungs/${dataUser?.data?.id}`, {
      id: dataUser?.data?.id,
      coCauToChucId: dataUser?.coCauToChucId,
      userName: dataUser?.data?.userName,
    });
    if (res) {
      toast.success('Cập nhật thành công!');
      dispatch(actionsModal.setRandomUsers());
      handleCancel();
    } else {
      toast.error('Thất bại, vui lòng thử lại!');
    }
  };

  const handleXoaNguoiDungKhoiNhom = async (dataItem) => {
    var res = await requestDELETE(`api/v1/cocautochucnguoidungs/${dataItem.id}`);
    if (res) {
      toast.success('Cập nhật thành công!');
      dispatch(actionsModal.setRandomUsers());
      handleCancel();
    } else {
      toast.error('Thất bại, vui lòng thử lại!');
    }
  };

  const handleButton = async (type, item) => {
    switch (type) {
      case 'chi-tiet':
        console.log(item);
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));

        break;

      case 'cap-lai-mat-khau':
        handleKhoiPhucMatKhau(item);
        //setEditVanBan(true);
        break;

      case 'xoa-tai-khoan':
        var res = await requestDELETE(`api/users/${item.userName}`);
        if (res) {
          toast.success('Thao tác thành công!');
          dispatch(actionsModal.setRandomUsers());
        } else {
          toast.error('Thất bại, vui lòng thử lại!');
        }
        break;
      case 'cap-quyen':
        handleCapQuyen(item);
        //setEditVanBan(true);
        break;

      case 'xoanguoidungkhoinhom':
        ModalAntd.confirm({
          title: 'Xoá người dùng khỏi nhóm',
          content: 'Bạn có chắc chắn muốn xoá người dùng khỏi nhóm này?',
          okText: 'Đồng ý',
          cancelText: 'Huỷ',
          onOk: async () => {
            await handleXoaNguoiDungKhoiNhom(item);
          },
        });
        break;
      case 'chuyennhomnguoidung':
        setModalChuyenUser({ modalVisible: true, data: item });
        break;

      default:
        break;
    }
  };

  const columns = [
    // {
    //   title: 'Tài khoản',
    //   dataIndex: 'userName',
    //   key: 'userName',
    //   render: (text, record, index) => {
    //     return (
    //       <>
    //         <div className='d-flex align-items-center'>
    //           {/* begin:: Avatar */}
    //           <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
    //             <a href='#'>
    //               {record?.user?.imageUrl ? (
    //                 <div className='symbol-label'>
    //                   {/* <img src={toAbsoluteUrl(`/${record?.user?.imageUrl}`)} alt={record?.user?.fullName} className='w-100' /> */}
    //                 </div>
    //               ) : (
    //                 <div
    //                   className={clsx(
    //                     'symbol-label fs-3',
    //                     `bg-light-${record?.user?.isVerified ? 'danger' : ''}`,
    //                     `text-${record?.user?.isVerified ? 'danger' : ''}`
    //                   )}
    //                 ></div>
    //               )}
    //             </a>
    //           </div>
    //           <div className='d-flex flex-column'>
    //             <a href='#' className='text-gray-800 text-hover-primary mb-1 fw-bolder'>
    //               {record?.user?.fullName}
    //             </a>
    //             <span>{record?.user?.email}</span>
    //           </div>
    //         </div>
    //       </>
    //     );
    //   },
    // },
    {
      title: 'Tài khoản',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record, index) => {
        return (
          <div className='d-flex align-items-center'>
            {/* Avatar */}
            <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
              <a href='#'>
                {record?.user?.imageUrl ? (
                  <div className='symbol-label'>
                    {/* Load ảnh từ URL */}
                    <img
                      src={`${url}${record?.user?.imageUrl}`}
                      alt={record?.user?.fullName || 'Avatar'}
                      className='w-100 h-100 object-fit-cover'
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  // Hiển thị biểu tượng mặc định nếu không có ảnh
                  <div
                    className={clsx(
                      'symbol-label fs-3 bg-light',
                      `text-${record?.user?.isVerified ? 'danger' : getRandomColor(record?.user?.fullName)}`
                    )}
                    style={{ lineHeight: '100px', fontWeight: 'bold' }}
                  >
                    {record?.user?.fullName ? record?.user?.fullName[0] : 'U'}
                  </div>
                )}
              </a>
            </div>
            {/* Thông tin tài khoản */}
            <div className='d-flex flex-column'>
              <a href='#' className='text-gray-800 text-hover-primary mb-1 fw-bolder'>
                {record?.user?.fullName}
              </a>
              <span>{record?.user?.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      width: '25%',
      title: 'Tên đăng nhập',
      dataIndex: 'userName',
      key: 'userName',
    },

    {
      title: 'Thao tác',
      className: 'text-center',
      dataIndex: '',
      key: '',
      width: '15%',
      render: (text, record) => {
        return (
          <div>
            <a
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1'
              data-toggle='m-tooltip'
              title='Xem chi tiết/Sửa'
              onClick={() => {
                handleButton(`chi-tiet`, record?.user);
              }}
            >
              <i className='fa fa-edit'></i>
            </a>
            <Popconfirm
              title='Bạn có chắc muốn xoá người dùng?'
              onConfirm={() => {
                handleButton(`xoa-tai-khoan`, record?.user);
              }}
              okText='Xoá'
              cancelText='Huỷ'
            >
              <a className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1' data-toggle='m-tooltip' title='Xoá'>
                <i className='fa fa-trash'></i>
              </a>
            </Popconfirm>
            <Dropdown
              trigger={'click'}
              overlay={
                <Menu className='rounded'>
                  <Menu.Item key={Math.random().toString(32)}>
                    <a
                      className='e-1 p-2 text-dark'
                      onClick={() => {
                        handleButton(`cap-lai-mat-khau`, record?.user);
                      }}
                    >
                      <i className={`fa fa-key me-2`}></i>
                      {`Khôi phục mật khẩu`}
                    </a>
                  </Menu.Item>

                  <Menu.Item key={Math.random().toString(32)}>
                    <a
                      className='e-1 p-2 text-dark'
                      onClick={() => {
                        handleButton(`cap-quyen`, record?.user);
                      }}
                    >
                      <i className={`fa fa-certificate me-2`}></i>
                      {`Cấp quyền`}
                    </a>
                  </Menu.Item>
                  <Menu.Item key={Math.random().toString(32)}>
                    <a
                      className='e-1 p-2 text-dark'
                      onClick={() => {
                        handleButton(`chuyennhomnguoidung`, record);
                      }}
                    >
                      <i className={`fa fa-share me-2`}></i>
                      {`Chuyển nhóm người dùng`}
                    </a>
                  </Menu.Item>
                  <Menu.Item key={Math.random().toString(32)}>
                    <a
                      className='e-1 p-2 text-dark'
                      onClick={() => {
                        handleButton(`xoanguoidungkhoinhom`, record);
                      }}
                    >
                      <i className={`fa fa-trash me-2`}></i>
                      {`Xoá người dùng khỏi nhóm`}
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <a className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1' title='Thao tác nhanh'>
                <i className='fa fa-ellipsis-h'></i>
              </a>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className='px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between'>
        <h3 className='card-title fw-bold text-header-td fs-4 mb-0'>{`Danh sách người sử dụng ${dataModal?.name ?? ''}`}</h3>
        <div className='d-flex align-items-center'>
          {dataModal ? (
            <button
              className='btn btn-success btn-sm py-2 me-2'
              onClick={() => {
                setModalAddUser(true);
                /* dispatch(actionsModal.setDataModal(null));
                dispatch(actionsModal.setModalVisible(true)); */
              }}
            >
              <span>
                <i className='fas fa-plus  me-2'></i>
                <span className=''>Thêm mới</span>
              </span>
            </button>

          ) : (
            <></>
          )}
        </div>
      </div>
      <div className='card-body card-dashboard px-3 py-3'>
        <div className='card-dashboard-body table-responsive'>
          <Input
            placeholder='Tìm kiếm người dùng'
            className='mb-3'
            value={keySearch}
            onChange={(e) => {
              setKeySearch(e.target.value);
            }}
          />
          <Table
            bordered={true}
            rowKey={(record) => Math.random().toString()}
            size='small'
            columns={columns}
            //dataSource={_.orderBy(dataTable, [`ProfileOrder`], ['asc']) || []}
            //dataSource={dataTable}
            dataSource={dataTable.filter((i) => {
              const name = (i?.user?.fullName ?? '').toUpperCase();
              const userName = (i?.user?.userName ?? '').toUpperCase();
              return name.indexOf(keySearch.toUpperCase()) > -1 || userName.indexOf(keySearch.toUpperCase()) > -1;
            })}
            pagination={{
              style: {
                margin: 10,
              },
              showSizeChanger: true,
              defaultPageSize: 20,
              position: ['bottomRight'],
            }}
            loading={loading}
          />
        </div>
      </div>
      {modalVisible ? <ModalItem setUpdate={setUpdate} update={update} /> : <></>}
      {modalCapQuyen ? <ChiTietPermissionModal modalVisible={modalCapQuyen} userHandle={userHandle} handleCancel={handleCancel} level ={level} /> : <></>}

      {modalAddUser ? <ChiTietModalAddUser modalVisible={modalAddUser} handleCancel={handleCancelAddUser} userHandle={addUserToNhom} /> : <></>}
      {modalChuyenUser && modalChuyenUser.modalVisible == true ? (
        <ChiTietModalChuyenUser
          modalVisible={modalChuyenUser?.modalVisible}
          handleCancel={handleCancelAddUser}
          userHandle={chuyenUserToNhom}
          dataModal={modalChuyenUser}
        />
      ) : (
        <></>
      )}

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
