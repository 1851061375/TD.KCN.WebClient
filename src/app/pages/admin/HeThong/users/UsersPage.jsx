/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as actionsModal from '@/redux/modal/Actions';
import UsersList from './components/UsersList';

const UsersPage = () => {
  return (
    <>
      <div className='card card-xl-stretch mb-xl-9'>
        <UsersList title='Danh sách người dùng' />
      </div>
    </>
  );
};

export default UsersPage;
