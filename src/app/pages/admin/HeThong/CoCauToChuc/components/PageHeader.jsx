/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {Menu, Dropdown} from 'antd';
import {toast} from 'react-toastify';

import {requestPOST} from '@/utils/baseAPI';
import * as actionsModal from '@/redux/modal/Actions';
//import ModalDongBo from 'src/app/pages/system/cocautochucs/components/ModalDongBo';

const PageHeader = (props) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const DongBoNguoiDung = async (dataDongBo) => {
    const res = await requestPOST(`api/v1/organizationunits/fetchdata`, dataDongBo);
    toast.success('Quá trình đồng bộ đang được thực hiện! Vui lòng truy cập lại chức năng sau 15 phút');
    setModalVisible(false);
  };

  const handleButton = async (type) => {
    switch (type) {
      case 'themnhomcon':
        dispatch(actionsModal.setCurrentOrganizationUnit(null));
        dispatch(actionsModal.setModalOrganizationUnit({modalVisible: true, type: 'themnhomcon'}));
        break;
      case 'donbococau':
        setModalVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className='px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between'>
        <h3 className='card-title fw-bold text-header-td fs-4 mb-0'>{props?.title ?? ''}</h3>
        <div className='d-flex align-items-center'>
          <Dropdown
            trigger={'click'}
            overlay={
              <Menu className='rounded'>
                <Menu.Item key={Math.random().toString(32)}>
                  <a
                    className='e-1 p-2 text-dark'
                    onClick={() => {
                      handleButton(`themnhomcon`);
                    }}
                  >
                    <i className={`fas fa-plus me-2`}></i>
                    {`Thêm nhóm gốc`}
                  </a>
                </Menu.Item>
                {/* <Menu.Item key={Math.random().toString(32)}>
                  <a
                    className='e-1 p-2 text-dark'
                    onClick={() => {
                      handleButton(`donbococau`);
                    }}
                  >
                    <i className={`fa fa-sync me-2`}></i>
                    {`Đồng bộ cơ cấu`}
                  </a>
                </Menu.Item> */}
              </Menu>
            }
          >
            <a className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1' title='Thao tác nhanh'>
              <i className='fa fa-ellipsis-h'></i>
            </a>
          </Dropdown>
        </div>
      </div>
      {/* <ModalDongBo modalVisible={modalVisible} onCancel={() => setModalVisible(false)} onFinish={DongBoNguoiDung} /> */}
    </>
  );
};

export default PageHeader;
