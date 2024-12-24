import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsProps } from 'antd';

import { AppDispatch, RootState } from '@/redux/Store';
import OrganizationUnitDetail from './OrganizationUnitDetail';
import OrganizationUnitUsers from './OrganizationUnitUsers';
import * as actionsOrganizationUnit from '@/redux/organization-unit/Actions';
import ModalAddUsersToOrganizationUnit from './ModalAddUsersToOrganizationUnit';

const items: TabsProps['items'] = [
  {
    key: 'organization-unit-users',
    label: 'Thông tin người dùng',
    children: <OrganizationUnitUsers />,
  },
  {
    key: 'organization-unit-detail',
    label: 'Thông tin đơn vị',
    children: <OrganizationUnitDetail />,
  },
];

const OrganizationUnitRightContent = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentOrganizationUnit = useSelector((state: RootState) => state.organizationUnit.selectedOrganizationUnit);
  const modalAddUsersVisible = useSelector((state: RootState) => state.organizationUnit.modalAddUsersVisible);

  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <>
      <div className="d-flex flex-column">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between flex-wrap h-50px">
          <div className="d-flex align-items-center">
            <h3 className="card-title fw-bold text-header-td fs-4 mb-0 mb-lg-0">
              {currentOrganizationUnit?.name ?? 'Lựa chọn đơn vị để xem thông tin chi tiết'}
            </h3>
          </div>
          <div className="card-toolbar">
            {currentOrganizationUnit?.id && (
              <button className="btn btn-primary btn-sm py-2 me-2" onClick={() => dispatch(actionsOrganizationUnit.setModalAddUsersVisible(true))}>
                <span>
                  <i className="fas fa-plus me-2"></i>
                  <span className="">Thêm người dùng</span>
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="card-body px-3 py-3">
          <Tabs defaultActiveKey={'organization-unit-users'} items={items} onChange={onChange} />
        </div>
      </div>
      {modalAddUsersVisible && <ModalAddUsersToOrganizationUnit />}
    </>
  );
};

export default OrganizationUnitRightContent;
