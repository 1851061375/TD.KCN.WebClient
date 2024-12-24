/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import { useAuth } from '@/app/modules/auth';
import {Form, Input, Select, Spin, DatePicker, InputNumber} from 'antd';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';
import TableList from '@/app/components/TableList';
import {toAbsoluteUrl} from '@/utils/AssetHelpers';
import clsx from 'clsx';
import {requestPOST} from '@/utils/baseAPI';

const ModalItem = (props) => {
  const {userHandle, handleCancel, modalVisible} = props;
  const { currentUser } = useAuth();
  const [dataTable, setDataTable] = useState([]);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(1);
  const [keywordSearch, setKeywordSearch] = useState('');
  const colors = [
    'primary', 'success', 'info', 'warning', 'danger',
    'secondary', 'light', 'dark',
  ];
  const url = 'https://minioapi.hanhchinhcong.net/';
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(`api/users/search`, {
          advancedSearch: {
            fields: ['fullName', 'userName', 'email'],
            keyword: keywordSearch && keywordSearch.length > 0 ? keywordSearch : null,
          },
          organizationUnitId:currentUser?.organizationUnitId,
          keyword: keywordSearch && keywordSearch.length > 0 ? keywordSearch : null,
          pageNumber: offset,
          pageSize: size,
          orderBy: ['fullName'],
          //type: 1,
        });
        setDataTable(res.data?.data ?? []);
        setCount(res?.totalCount ?? 0);
        setLoading(false);
        setUpdate(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [offset, size, keywordSearch]);

  const onFinish = async () => {
    userHandle(selectedUser);
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
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedUser(selectedRows.length > 0 ? selectedRows[0] : null);
    },
    getCheckboxProps: (record) => ({
      name: record.name,
    }),
  };

  const columns = [
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
                {record.imageUrl ? (
                  <div className='symbol-label'>
                    {/* Load ảnh từ URL */}
                    <img
                      src={`${url}${record.imageUrl}`}
                      alt={record.fullName || 'Avatar'}
                      className='w-100 h-100 object-fit-cover'
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  // Hiển thị biểu tượng mặc định nếu không có ảnh
                  <div
                    className={clsx(
                      'symbol-label fs-3 bg-light',
                      `text-${record.isVerified ? 'danger' : getRandomColor(record.fullName)}`
                    )}
                    style={{ lineHeight: '100px', fontWeight: 'bold' }}
                  >
                    {record.fullName ? record.fullName[0] : 'U'}
                  </div>
                )}
              </a>
            </div>
            {/* Thông tin tài khoản */}
            <div className='d-flex flex-column'>
              <a href='#' className='text-gray-800 text-hover-primary mb-1 fw-bolder'>
                {record.fullName}
              </a>
              <span>{record.email}</span>
            </div>
          </div>
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
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
  ];

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
        <Modal.Title className='text-white'>Lựa chọn người dùng vào nhóm</Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Input
          placeholder='Tìm kiếm người dùng'
          className='mb-3'
          value={keywordSearch}
          onChange={(e) => {
            setKeywordSearch(e.target.value);
          }}
        />
        <TableList
          dataTable={dataTable}
          columns={columns}
          isPagination={true}
          size={size}
          count={count}
          setOffset={setOffset}
          setSize={setSize}
          loading={loading}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
        />
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-success rounded-1 p-2  ms-2' onClick={onFinish}>
            <i className='fa fa-save'></i>
            Đồng ý
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
