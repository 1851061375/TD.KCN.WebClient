/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import * as actionsModal from '@/redux/modal/Actions';

import PageHeader from './components/PageHeader';

import ItemsList from './components/ItemsNhomList';
import ItemsUserList from './components/ItemsUserList';

const RolesPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionsModal.resetData());

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='row'>
      <div className='col-xl-4'>
        <div className='card card-xl-stretch mb-xl-9'>
          <PageHeader title='Cơ cấu tổ chức' />
          <ItemsList />
        </div>
      </div>
      <div className='col-xl-8'>
        <div className='p-3 card card-xl-stretch mb-xl-9'>
          <ItemsUserList />
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
