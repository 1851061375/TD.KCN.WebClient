import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Collapse from 'react-bootstrap/Collapse';
import { Form, Input, Select, Spin, DatePicker, InputNumber } from 'antd';
import LoginLogsTable from './components/LoginLogsTable';
import { AppDispatch } from '@/redux/Store';
import * as actionsModal from '@/redux/modal/Actions';
import { DefaultOptionType } from 'antd/es/select';
import { SearchData } from '@/types';
import { Content } from '@/_metronic/layout/components/content';
import { TDSelect } from '@/app/components';
import { requestPOST } from '@/utils/baseAPI';
import { IPaginationResponse, IResult, IUserDto } from '@/models';
import _ from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

const LoginLogsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm<SearchData>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<SearchData | undefined>(undefined);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const handleSearch = (): void => {
    const formData = form.getFieldsValue(true);
    setSearchData(formData);
  };

  const handleReset = (): void => {
    form.resetFields();
    setSearchData(undefined);
  };

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
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
    if (dates) {
      setSearchData((prev) => ({
        ...prev,
        fromDate: dates[0]?.format('YYYY-MM-DD') || '',
        toDate: dates[1]?.format('YYYY-MM-DD') || '',
      }));
    } else {
      setSearchData((prev) => ({
        ...prev,
        fromDate: '',
        toDate: '',
      }));
    }
  };
  return (
    <>
      <Content>
        <div className="card card-xl-stretch mb-xl-9">
          <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
            <h3 className="card-title fw-bold text-header-td fs-4 mb-0">{'Nhật ký hệ thống'}</h3>
            <div className="card-toolbar d-flex align-items-center gap-3 flex-wrap">
              <div className="btn-group me-2 w-200px">
                <input type="text" className="form-control form-control-sm" placeholder="Nhập từ khoá tìm kiếm" onChange={handleKeywordChange} />
              </div>
              <div className="d-flex align-items-center me-2">
                <TDSelect reload showSearch placeholder="Chọn người dùng"
                  fetchOptions={async keyword => {
                    const res = await requestPOST<IPaginationResponse<IUserDto[]>>(`api/users/search`, {
                      pageNumber: 1,
                      pageSize: 1000,
                      keyword: keyword
                    });
                    return (
                      res.data?.data?.map(item => ({
                        ...item,
                        label: item?.userName,
                        value: item?.id,
                      })) ?? []
                    );
                  }}
                  style={{
                    width: 200,
                  }}
                  onChange={(value, current: any) => {
                    if (value) {
                      setSearchData({
                        ...searchData,
                        userId: value.value
                      });
                    } else {
                      setSearchData({
                        ...searchData,
                        userId: null
                      });
                    }
                  }} />
              </div>
              <div className='d-flex align-items-center'>
                {/* <span className='fw-bold px-3'>Ngày</span> */}
                <RangePicker
                  format="DD-MM-YYYY"
                  style={{ width: '250px' }}
                  onChange={handleDateChange}
                />
              </div>
              {/* <button className="btn btn-primary btn-sm py-2 me-2" onClick={handleAddNew}>
                <span>
                  <i className="fas fa-plus  me-2"></i>
                  <span className="">Thêm mới</span>
                </span>
              </button> */}
            </div>
          </div>
          <div>
            <Collapse in={isOpen}>
              <div className="card card-body">
                <Form form={form} autoComplete="off">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <FormItem label="Từ khoá" name="keyword">
                        <Input placeholder="" />
                      </FormItem>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-xl-12 col-lg-12 d-flex justify-content-center">
                      <button className="btn btn-primary btn-sm m-btn m-btn--icon py-2 me-2" onClick={handleSearch}>
                        <span>
                          <i className="fas fa-search"></i>
                          <span className="">Tìm kiếm</span>
                        </span>
                      </button>
                      <button className="btn btn-secondary btn-sm m-btn m-btn--icon py-2 me-2" onClick={handleReset}>
                        <span>
                          <i className="fas fa-sync"></i>
                          <span className="">Tải lại</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </Collapse>
          </div>
          <LoginLogsTable searchData={searchData} />
        </div>
      </Content>
    </>
  );
};

export default LoginLogsPage;
