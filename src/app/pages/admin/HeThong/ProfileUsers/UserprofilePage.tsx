import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form} from 'antd';
import {UserProfileModal} from './component/UserProfileModal';
import { AppDispatch } from '@/redux/Store';
import * as actionsModal from '@/redux/modal/Actions';
import { Content } from '@/_metronic/layout/components/content';
import './component/index.scss'
const FormItem = Form.Item;

const UserProfilesPage = () => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Content>
        <div className="card card-xl-stretch mb-xl-9 profile-container">
          <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
            <h3 className="card-title fw-bold text-header-td fs-4 mb-0">{'Thông tin người dùng'}</h3>
          </div>
          <UserProfileModal />
        </div>
      </Content>
    </>
  );
};

export default UserProfilesPage;
