import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'antd';

import { RootState } from '@/redux/RootReducer';
import { AppDispatch } from '@/redux/Store';
import * as actionsOrganizationUnit from '@/redux/organization-unit/Actions';

import ModalOrganizationUnitDetail from './ModalOrganizationUnitDetail';
import OrganizationUnitsTree from './OrganizationUnitsTree';
const OrganizationUnitLeftContent = () => {
  const dispatch: AppDispatch = useDispatch();
  const modalState = useSelector((state: RootState) => state.organizationUnit.modalState);

  /* const DongBoNguoiDung = async dataDongBo => {
    const res = await requestPOST(`api/v1/organizationunits/fetchdata`, dataDongBo);
    toast.success('Quá trình đồng bộ đang được thực hiện! Vui lòng truy cập lại chức năng sau 15 phút');
    setModalVisible(false);
  }; */

  const handleButton = async type => {
    switch (type) {
      case 'them-nhom-goc':
        dispatch(actionsOrganizationUnit.setModalVisible({ modalVisible: true, type: 'createChild', modalData: null }));
        break;
      case 'sync':
        /* setModalVisible(true); */
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="d-flex flex-column">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between h-50px">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0">{'Cơ cấu tổ chức'}</h3>
          <div className="d-flex align-items-center">
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'them-nhom-goc',
                    label: (
                      <a
                        className="e-1 p-2 text-dark"
                        onClick={() => {
                          handleButton(`them-nhom-goc`);
                        }}
                      >
                        <i className={`fas fa-plus me-2`}></i>
                        {`Thêm nhóm gốc`}
                      </a>
                    ),
                  },
                  {
                    key: 'sync',
                    label: (
                      <a
                        className="e-1 p-2 text-dark"
                        onClick={() => {
                          handleButton(`sync`);
                        }}
                      >
                        <i className={`fa fa-sync me-2`}></i>
                        {`Đồng bộ cơ cấu`}
                      </a>
                    ),
                  },
                ],
              }}
            >
              <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1" title="Thao tác nhanh">
                <i className="fa fa-ellipsis-h"></i>
              </a>
            </Dropdown>
          </div>
        </div>
        <OrganizationUnitsTree />
      </div>
      {modalState?.modalVisible ? <ModalOrganizationUnitDetail /> : <></>}
    </>
  );
};

export default OrganizationUnitLeftContent;
