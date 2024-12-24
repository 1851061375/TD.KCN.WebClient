import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import { TDSelect } from '@/app/components';
import { requestPOST } from '@/utils/baseAPI';
import { IOrganizationUnitDetails, IPaginationResponse } from '@/models';
import { DefaultOptionType } from 'antd/es/select';
const { Option } = Select;
const { RangePicker } = DatePicker;

const WidgetTop = () => {
    const [thoiGianFrom, setThoiGianFrom] = useState('');
    const [thoiGianTo, setThoiGianTo] = useState('');
    return (
        <div
            className='tdaaa d-flex bg-white p-2 rounded'
            data-kt-sticky='true'
            data-kt-sticky-name='tdaaa'
            data-kt-sticky-offset="{default: '150px', lg: '200px'}"
        >
            <div className='flex-grow-1 d-flex align-items-center'>
                <span
                    className='btn btn-light btn-icon me-1'

                    title='Quay lại'
                >
                    <i className='fas fa-arrow-left text-dark-50'></i>
                </span>
                <span
                    className='btn btn-light btn-icon me-1'

                    title='Đơn vị gốc'
                >
                    <i className='fas fa-home text-dark-50'></i>
                </span>
                <div className='flex-grow-1 h-45px rounded border d-flex align-items-center hoverable'>
                    <TDSelect
                        showSearch
                        placeholder="Tất cả"
                        fetchOptions={async (keyword) => {
                            const res = await requestPOST<IPaginationResponse<IOrganizationUnitDetails[]>>(
                                `api/v1/organizationunits/search`,
                                {
                                    pageNumber: 1,
                                    pageSize: 1000,
                                    keyword: keyword,
                                }
                            );
                            return (
                                res.data?.data?.map((item) => ({
                                    ...item,
                                    label: item?.name,
                                    value: item?.id,
                                })) ?? []
                            );
                        }}
                        style={{ width: "100%" }}
                        onChange={(value, current: any) => {
                            if (value) {
                                console.log(current)

                            }
                        }}
                    />
                    <div className='d-flex justify-content-center align-items-center'>
                        <span className='fw-bold px-3'>Ngày</span>
                        <RangePicker
                            format="DD-MM-YYYY"
                            style={{ width: '250px' }}
                        />
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <span className='fw-bold px-3' style={{ width: '120px' }}>Loại nhiệm vụ</span>
                        <Select
                            showSearch
                            labelInValue
                            size='middle'
                            style={{ width: '300px' }}
                            defaultValue={'Nhiệm vụ chủ trì xử lý'}
                            placeholder='Loại nhiệm vụ'
                        >

                            <Option value='Nhiệm vụ chủ trì xử lý'>
                                Nhiệm vụ chủ trì xử lý
                            </Option>
                            <Option value='Nhiệm vụ giao'>
                                Nhiệm vụ giao
                            </Option>
                        </Select>
                    </div>


                </div>
            </div>

        </div>
    );
};

export { WidgetTop };
