import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import { TDSelect } from '@/app/components';
import { requestPOST } from '@/utils/baseAPI';
import { IOrganizationUnitDetails, IPaginationResponse } from '@/models';
import { DefaultOptionType } from 'antd/es/select';
import CardDashboard from '../Card/CardDashboard';
const { Option } = Select;
const { RangePicker } = DatePicker;

const Widget1 = () => {
    return (
        <CardDashboard />
    );
};

export { Widget1 };
