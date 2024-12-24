import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Flex, Splitter, Typography } from 'antd';

import { AppDispatch } from '@/redux/Store';
import * as actionsOrganizationUnit from '@/redux/organization-unit/Actions';

import OrganizationUnitRightContent from './components/OrganizationUnitRightContent';
import OrganizationUnitLeftContent from './components/OrganizationUnitLeftContent';
import { Content } from '@/_metronic/layout/components/content';

const OrganizationUnitsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(actionsOrganizationUnit.resetData());

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id="kt_app_content" className={'app-content flex-column-fluid d-flex'}>
        <div id="kt_app_content_container" className={'app-container container-fluid d-flex flex-column-fluid'}>
          <div className="d-flex bg-white flex-column-fluid">
            <Splitter>
              <Splitter.Panel defaultSize="30%" min="20%" max="60%" collapsible>
                <OrganizationUnitLeftContent />
              </Splitter.Panel>
              <Splitter.Panel collapsible>
                <OrganizationUnitRightContent />
              </Splitter.Panel>
            </Splitter>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganizationUnitsPage;
