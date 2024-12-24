/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form } from 'antd';
import { AppDispatch } from '@/redux/Store';
import { Content } from '@/_metronic/layout/components/content';

import * as actionsModal from '@/redux/modal/Actions';
import { SearchData } from '@/types';

import { PageHeader, ReportMetricTree, ReportMtricInfo } from './components';


const ChiTieuBaoCaosPage = () => {

  const dispatch: AppDispatch = useDispatch();
  const [searchData, setSearchData] = useState<SearchData | undefined>(undefined);

  const [dataFromTree, setDataFromTree] = useState(null);


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

  const onDataFromTree = (data) => {
    debugger
    setDataFromTree(data)
  }

  return (
    <Content>
      <div className="row">
        <div className="col-xl-5">
          <div className="card card-xl-stretch mb-xl-9 h-100">
            <PageHeader title="Chỉ tiêu báo cáo" showToolbar={true} />
            <ReportMetricTree
              onDataFromTree={onDataFromTree}
            />
          </div>
        </div>
        <div className="col-xl-7">
          <div className="card card-xl-stretch mb-xl-9 h-100">
            <PageHeader title="Thông tin chi tiết" />
            <ReportMtricInfo
              dataModal={dataFromTree}
            />
          </div>
        </div>
      </div>
    </Content>
  );
};

export default ChiTieuBaoCaosPage;
