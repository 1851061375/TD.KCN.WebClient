import React, { useState, useEffect } from 'react';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import { TDSelect } from '@/app/components';
import { requestPOST } from '@/utils/baseAPI';
import { IOrganizationUnitDetails, IPaginationResponse } from '@/models';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

type ThoiGianItem = {
    name: string;
    value: string;
    valueint: number;
};

type ThoiGianState = {
    type?: string;
    value?: string;
    valueFrom?: string;
    valueTo?: string;
    year?: number;
    valueint?: number;
};
const WidgetTop = () => {
    const thisyear = moment().year();

    const listLoaiThoiGian = [
        { name: 'Ngày', value: 'Ngày', selected: false },
        { name: 'Tuần', value: 'Tuần', selected: false },
        { name: 'Tháng', value: 'Tháng', selected: true },
    ];

    const [listThoiGian, setListThoiGian] = useState<ThoiGianItem[]>([]);
    const [timeState, setTimeState] = useState<ThoiGianState>({
        type: 'Tháng',
        value: '',
        valueFrom: '',
        valueTo: '',
        year: thisyear,
    });

    useEffect(() => {
        const updateTimeOptions = () => {
            const arrLoaiThoiGian: ThoiGianItem[] = [];
            let currentThoiGian = '';
            let currentThoiGianFrom = '';
            let currentThoiGianTo = '';

            const selectedType = listLoaiThoiGian.find((i) => i.selected)?.name ?? '';

            switch (selectedType) {
                case 'Tháng':
                    for (let i = 12; i > 0; i--) {
                        arrLoaiThoiGian.push({ name: `Tháng ${i}`, value: `Tháng ${i}`, valueint: i });
                    }
                    currentThoiGian = `Tháng ${moment().month() + 1}`;
                    currentThoiGianFrom = moment().startOf('month').format('DD/MM/YYYY');
                    currentThoiGianTo = moment().endOf('month').format('DD/MM/YYYY');
                    break;
                case 'Tuần':
                    const weekCount = moment().weeksInYear();
                    for (let i = 0; i < weekCount; i++) {
                        arrLoaiThoiGian.push({ name: `Tuần ${i + 1}`, value: `Tuần ${i + 1}`, valueint: i + 1 });
                    }
                    currentThoiGian = `Tuần ${moment().get('week')}`;
                    currentThoiGianFrom = moment().startOf('week').format('DD/MM/YYYY');
                    currentThoiGianTo = moment().endOf('week').format('DD/MM/YYYY');
                    break;
                case 'Ngày':
                    currentThoiGianFrom = moment().format('DD/MM/YYYY');
                    currentThoiGianTo = moment().format('DD/MM/YYYY');
                    break;
                default:
                    break;
            }

            setListThoiGian(arrLoaiThoiGian);
            setTimeState((prevState) => ({
                ...prevState,
                value: currentThoiGian,
                valueFrom: currentThoiGianFrom,
                valueTo: currentThoiGianTo,
            }));
        };

        updateTimeOptions();
    }, [listLoaiThoiGian]);

    useEffect(() => {
        if ((timeState.year && timeState.value) || (timeState.valueFrom && timeState.valueFrom)) {
            const timeInt = listThoiGian.find((i) => i.value === timeState.value)?.valueint ?? 0;
            const selectedType = listLoaiThoiGian.find((i) => i.selected)?.value;
            let currentThoiGianFrom = '';
            let currentThoiGianTo = '';

            // Ensure timeInt and timeState.year are numbers, defaulting to a valid number if undefined
            const validTimeInt = timeInt ?? 1; // Default to 1 if undefined
            const validYear = timeState.year ?? new Date().getFullYear(); // Default to current year if undefined

            if (selectedType === 'Ngày') {
                currentThoiGianFrom = timeState.valueFrom ?? ''; // Default to empty string if undefined
                currentThoiGianTo = timeState.valueTo ?? ''; // Default to empty string if undefined
            } else {
                switch (selectedType) {
                    case 'Tháng':
                        currentThoiGianFrom = moment(`01/${validTimeInt}/${validYear}`, 'DD/M/YYYY')
                            .startOf('month')
                            .format('DD/MM/YYYY');
                        currentThoiGianTo = moment(`01/${validTimeInt}/${validYear}`, 'DD/M/YYYY')
                            .endOf('month')
                            .format('DD/MM/YYYY');
                        break;
                    case 'Tuần':
                        currentThoiGianFrom = moment().year(validYear).week(validTimeInt).startOf('week').format('DD/MM/YYYY');
                        currentThoiGianTo = moment().year(validYear).week(validTimeInt).endOf('week').format('DD/MM/YYYY');
                        break;
                    default:
                        break;
                }
            }



            setTimeState({
                type: selectedType,
                value: timeState.value,
                valueFrom: currentThoiGianFrom,
                valueTo: currentThoiGianTo,
                year: timeState.year,
                valueint: timeInt,
            });
        }
    }, [timeState.value, timeState.year, timeState.valueFrom, timeState.valueTo]);

    const childrenYear: JSX.Element[] = [];
    for (let i = thisyear; i > thisyear - 10; i--) {
        childrenYear.push(
            <Option key={i.toString(36) + i} value={i}>
                {i}
            </Option>
        );
    }

    return (
        <>
            <div
                className='tdaaa d-flex bg-white p-2 rounded'
                data-kt-sticky='true'
                data-kt-sticky-name='tdaaa'
                data-kt-sticky-offset="{default: '150px', lg: '200px'}"
            >
                <div className="flex-grow-1 d-flex align-items-center">
                    <span className="btn btn-light btn-icon me-1" title="Quay lại">
                        <i className="fas fa-arrow-left text-dark-50"></i>
                    </span>
                    <span className="btn btn-light btn-icon me-1" title="Đơn vị gốc">
                        <i className="fas fa-home text-dark-50"></i>
                    </span>
                    <div className="flex-grow-1 h-45px rounded border d-flex align-items-center hoverable">
                        <TDSelect
                            showSearch
                            placeholder="Đơn vị"
                            fetchOptions={async (keyword) => {
                                const res = await requestPOST<IPaginationResponse<IOrganizationUnitDetails[]>>(
                                    'api/v1/organizationunits/search',
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
                            style={{ width: '100%' }}
                        />
                    </div>

                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                    <div className="d-flex flex-row align-items-center ps-2">
                        <span className="me-2 fw-bold">Loại thời gian :</span>
                        <Select
                            showSearch
                            labelInValue
                            size="middle"
                            style={{ marginRight: '5px' }}
                            placeholder="Loại thời gian"
                            value={{ value: timeState.type }}
                            onChange={(e) => {
                                setTimeState({ ...timeState, type: e.value });
                            }}
                        >
                            {listLoaiThoiGian.map((i, index) => (
                                <Option key={index} value={i.value}>
                                    {i.name}
                                </Option>
                            ))}
                        </Select>
                        {timeState.type !== 'Ngày' ? (
                            <>
                                <span className="me-2 fw-bold">Thời gian :</span>
                                <Select
                                    showSearch
                                    size="middle"
                                    style={{ marginRight: '5px' }}
                                    placeholder="Thời gian"
                                    value={timeState.value}
                                    onChange={(e) => setTimeState({ ...timeState, value: e })}
                                >
                                    {listThoiGian.map((i, index) => (
                                        <Option key={index} value={i.value}>
                                            {i.name}
                                        </Option>
                                    ))}
                                </Select>
                                <span className="me-2 fw-bold">Năm :</span>
                                <Select
                                    showSearch
                                    size="middle"
                                    style={{ marginRight: '5px' }}
                                    placeholder="Lựa chọn năm"
                                    value={timeState.year}
                                    onChange={(e) => setTimeState({ ...timeState, year: e })}
                                >
                                    {childrenYear}
                                </Select>
                            </>
                        ) : (
                            <>
                                <span className="me-2 fw-bold">Ngày :</span>

                                <RangePicker
                                    allowClear={false}
                                    size="large"
                                    placeholder={['Từ ngày', 'Đến ngày']}
                                    value={[dayjs(timeState.valueFrom, 'DD/MM/YYYY'), dayjs(timeState.valueTo, 'DD/MM/YYYY')]}
                                    onChange={(day) => {
                                        // Check if day is not null
                                        if (day && day[0] && day[1]) {
                                            setTimeState({
                                                ...timeState,
                                                valueFrom: dayjs(day[0]).format('DD/MM/YYYY'),
                                                valueTo: dayjs(day[1]).format('DD/MM/YYYY'),
                                            });
                                        }
                                    }}
                                    format="DD/MM/YYYY"
                                    style={{ width: '100%' }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

        </>
    );
};

export default WidgetTop;
