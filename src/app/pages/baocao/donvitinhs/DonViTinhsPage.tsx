/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import Collapse from 'react-bootstrap/Collapse';
import { AppDispatch } from '@/redux/Store';
import { Content } from '@/_metronic/layout/components/content';

import * as actionsModal from '@/redux/modal/Actions';
import { SearchData } from '@/types';

import DataTable from './components/DataTable';

const LoaiBaoCaosPage = () => {

  const dispatch: AppDispatch = useDispatch();
  const [searchData, setSearchData] = useState<SearchData | undefined>(undefined);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchData(prev => ({
      ...prev,
      keyword: e.target.value,
    }));
  };

  const handleAddNew = (): void => {
    dispatch(actionsModal.setDataModal({ readOnly: false }));
    dispatch(actionsModal.setModalVisible(true));
  };

  return (
    <Content>
      <div className="card card-xl-stretch mb-xl-9">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0">{'Đơn vị tính'}</h3>
          <div className="card-toolbar">
            <div className="btn-group me-2 w-200px">
              <input type="text" className="form-control form-control-sm" placeholder="Nhập từ khoá tìm kiếm" onChange={handleKeywordChange} />
            </div>

            <button className="btn btn-success btn-sm py-2 me-2" onClick={handleAddNew}>
              <span>
                <i className="fas fa-plus  me-2"></i>
                <span className="">Thêm mới</span>
              </span>
            </button>
          </div>
        </div>
        <div>
        </div>
        <div className="card-body p-0">
          <div className="row">
            <div className="col-xl-12">
              <DataTable searchData={searchData} />
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default LoaiBaoCaosPage;
