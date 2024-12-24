/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import * as actionsModal from '@/redux/modal/Actions';
import { requestPOST, requestDELETE } from '@/utils/baseAPI';
import TableList from '@/app/components/TableList';
import ModalItem from './ChiTietNhomNguoiDungModal';
import { render } from 'sass';

const UsersList = (props) => {
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const { selectKeHoach, rowSelected, setRowSelected } = props;
  const random = useSelector((state) => state.modal.random);
  const {dataSearch} = props;
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState('');
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/vaitros/search`,
          _.assign({
            advancedSearch: {
              fields: ['ten', 'ma'],
              keyword: dataSearch?.keywordSearch ?? null,
            },
            pageNumber: offset,
            pageSize: size,
            orderBy: ['createdOn ASC'],
          },
          dataSearch)
        );
        setDataTable(res?.data?.data ?? []);
        setCount(res?.data?.totalCount ?? 0);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => { };
  }, [offset, size, selectKeHoach, random, dataSearch]);

  const handleButton = async (type, item) => {
    switch (type) {
      case 'chi-tiet':
        dispatch(actionsModal.setDataModal({ ...item, mode: 'view' }));
        dispatch(actionsModal.setModalVisible(true));
        break;
      case 'edit':
        dispatch(actionsModal.setDataModal({ ...item, mode: 'edit' }));
        dispatch(actionsModal.setModalVisible(true));
        break;
      case 'delete':
        var res = await requestDELETE(`api/v1/vaitros/${item.id}`);
        if (res) {
          toast.success('Thao tác thành công!');
          dispatch(actionsModal.setRandom());
        } else {
          toast.error('Thất bại, vui lòng thử lại!');
        }
        break;
        break;
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma',
    },
    {
      title: 'Thao tác',
      dataIndex: '',
      key: '',
      width: '5%',
      className: 'text-center',
      render: (text, record) => {
        return (
          <div>
            {/* <a
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1'
              data-toggle='m-tooltip'
              title='Xem chi tiết'
              onClick={() => {
                handleButton(`chi-tiet`, record);
              }}
            >
              <i className='fa fa-eye'></i>
            </a> */}
            <a
              className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1'
              data-toggle='m-tooltip'
              title='Phân quyền'
              onClick={() => {
                handleButton(`edit`, record);
              }}
            >
              <i className='fa fa-certificate'></i>
            </a>
            {/* <Popconfirm
              title='Xoá?'
              onConfirm={() => {
                handleButton(`delete`, record);
              }}
              okText='Xoá'
              cancelText='Huỷ'
            >
              <a className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1' data-toggle='m-tooltip' title='Xoá'>
                <i className='fa fa-trash'></i>
              </a>
            </Popconfirm> */}
          </div>
        );
      },
    },
  ];
  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      if (selected) {
        if (!rowSelected.some((row) => row.id === record.id)) {
          setRowSelected([...rowSelected, record]);
        }
      } else {
        setRowSelected(rowSelected.filter((row) => row.id !== record.id));
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        setRowSelected(selectedRows);
      } else {
        setRowSelected([]);
      }
    },
  };
  return (
    <>
      <div className='card-body card-dashboard px-3 py-3'>
        <div className='card-dashboard-body table-responsive'>
          <TableList
            dataTable={dataTable}
            columns={columns}
            isPagination={true}
            size={size}
            count={count}
            setOffset={setOffset}
            setSize={setSize}
            loading={loading}
            rowSelection={rowSelection}
          />
        </div>
      </div>
      {modalVisible ? <ModalItem /> : <></>}
    </>
  );
};

export default UsersList;
