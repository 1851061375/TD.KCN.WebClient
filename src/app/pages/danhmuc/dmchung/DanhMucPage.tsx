import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from './components/DataTable';
import { AppDispatch } from '@/redux/Store';
import * as actionsModal from '@/redux/modal/Actions';
import { SearchData } from '@/types';
import { Content } from '@/_metronic/layout/components/content';
import { TDSelect } from '@/app/components';
import { requestPOST } from '@/utils/baseAPI';
import { INhomDanhMuc, IPaginationResponse } from '@/models';
import { DefaultOptionType } from 'antd/es/select';

const DanhMucPage = () => {
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
    <>
      <Content>
        <div className="card card-xl-stretch mb-xl-9">
          <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
            <h3 className="card-title fw-bold text-header-td fs-4 mb-0">{'Danh mục chung'}</h3>
            <div className="card-toolbar">
              <div className="btn-group me-2 w-200px">
                <input type="text" className="form-control form-control-sm" placeholder="Nhập từ khoá tìm kiếm" onChange={handleKeywordChange} />
              </div>
              <div className="btn-group align-items-center mx-3 mb-lg-2">
                <span className="fw-bold">Nhóm danh mục:</span>
                <TDSelect
                  reload
                  showSearch
                  placeholder="Chọn"
                  fetchOptions={async keyword => {
                    const res = await requestPOST<IPaginationResponse<INhomDanhMuc[]>>(`api/v1/nhomdanhmucs/search`, {
                      pageNumber: 1,
                      pageSize: 1000,
                      keyword: keyword,
                    });
                    return (
                      res.data?.data?.map(item => ({
                        ...item,
                        label: item?.ten,
                        value: item?.id,
                      })) ?? []
                    );
                  }}
                  style={{
                    width: 250,
                    marginLeft: 20,
                  }}
                  onChange={(value, current: any) => {
                    if (value) {
                      setSearchData({
                        ...searchData,
                        nhomDanhMucId: current?.id,
                      });
                    } else {
                      setSearchData({
                        ...searchData,
                        nhomDanhMucId: null,
                      });
                    }
                  }}
                />
              </div>
              <button className="btn btn-success btn-sm py-2 me-2" onClick={handleAddNew}>
                <span>
                  <i className="fas fa-plus  me-2"></i>
                  <span className="">Thêm mới</span>
                </span>
              </button>
            </div>
          </div>
          <DataTable searchData={searchData} />
        </div>
      </Content>
    </>
  );
};

export default DanhMucPage;
