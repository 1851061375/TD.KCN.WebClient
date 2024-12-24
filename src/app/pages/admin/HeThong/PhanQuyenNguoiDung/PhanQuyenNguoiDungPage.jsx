/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import Collapse from 'react-bootstrap/Collapse';
import * as actionsModal from '@/redux/modal/Actions';
import ItemNhomNguoiDungsList from './components/ItemNhomNguoiDungsList';
import ItemUsersList from './components/ItemUsersList';
import { TDSelect } from '@/app/components';

const FormItem = Form.Item;

const PhanQuyenNguoiDungPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Phân quyền nhóm người dùng');
  const [dataSearch, setDataSearch] = useState(null);


  return (
    <>
      <div className='card card-xl-stretch mb-xl-9'>
        <div className='px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between'>
          {/* <h3 className='card-title fw-bold text-header-td fs-4 mb-0'>{'Kế hoạch thanh tra'}</h3> */}
          <div>
            <h2 className='card-title fw-bold text-header-td fs-4 mb-0'>{'Phân quyền người dùng'}</h2>
            <div className='mt-2'>


            </div>
          </div>
          <div className='card-toolbar'>
            <div className='btn-group me-2 w-200px'>
              <input
                allowClear={true}
                type='text'
                className='form-control form-control-sm'
                placeholder='Nhập từ khoá tìm kiếm'
                onChange={(e) => {
                  setDataSearch({...dataSearch, keywordSearch: e.target.value});
                }}
              />
            </div>
            <div className="btn-group align-items-center">
              <TDSelect
                placeholder="Chọn"
                value={selectedValue} // Thiết lập giá trị mặc định
                fetchOptions={async () => [
                  { label: 'Phân quyền nhóm người dùng', value: 'Phân quyền nhóm người dùng' },
                  { label: 'Phân quyền người dùng', value: 'Phân quyền người dùng' },
                ]}
                style={{ width: 250 }}
                onChange={(value, current) => {
                  setSelectedValue(current?.value || ''); // Cập nhật giá trị được chọn
                }}
              />
            </div>

          </div>
        </div>
        {selectedValue === 'Phân quyền nhóm người dùng' ? (
          <ItemNhomNguoiDungsList dataSearch={dataSearch}/>
        ) : selectedValue === 'Phân quyền người dùng' ? (
          <ItemUsersList dataSearch={dataSearch}/>
        ) : null}
      </div>
    </>
  );
};

export default PhanQuyenNguoiDungPage;
