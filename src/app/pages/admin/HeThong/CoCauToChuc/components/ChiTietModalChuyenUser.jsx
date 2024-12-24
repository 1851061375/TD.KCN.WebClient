/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/modules/auth';
import { TreeSelect, Spin } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { requestPOST } from '@/utils/baseAPI';

const ModalItem = (props) => {
  const { userHandle, handleCancel, modalVisible, dataModal } = props;
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [treeData, setTreeData] = useState([]);

  const [value, setValue] = useState(dataModal?.data?.coCauToChucId ?? null);

  const onChange = (newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Gọi API lấy dữ liệu
        const res = await requestPOST(`api/v1/organizationunits/gettree/search`, {
          advancedSearch: {
            fields: ['name', 'code'],
            keyword: null,
          },
          parentId: currentUser?.organizationUnitId ?? "",
          pageNumber: 1,
          pageSize: 100000,
          orderBy: ['name'],
        });

        const data = res?.data?.data ?? [];

        // Hàm đệ quy xây dựng tree bắt đầu từ node cha
        const buildTreeFromRoot = (items, rootId) => {
          const rootNode = items.find((item) => item.id === rootId);

          const buildChildren = (parentId) =>
            items
              .filter((item) => item.parentId === parentId)
              .map((child) => ({
                ...child,
                title: child.name,
                key: child.id,
                value: child.id,
                children: buildChildren(child.id),
              }));

          return rootNode
            ? [
                {
                  ...rootNode,
                  title: rootNode.name,
                  key: rootNode.id,
                  value: rootNode.id,
                  children: buildChildren(rootNode.id),
                },
              ]
            : [];
        };

        // Xây dựng tree từ node cha là currentUser?.organizationUnitId
        const tree = buildTreeFromRoot(data, currentUser?.organizationUnitId);
        setTreeData(tree);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tree data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.organizationUnitId]);

  const onFinish = async () => {
    userHandle({ coCauToChucId: value, data: dataModal?.data });
  };

  return (
    <Modal
      show={modalVisible}
      fullscreen={'lg-down'}
      size='xl'
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className='bg-primary px-4 py-3'>
        <Modal.Title className='text-white'>Chuyển nhóm người dùng</Modal.Title>
        <button
          type='button'
          className='btn-close btn-close-white'
          aria-label='Close'
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loading}>
          <TreeSelect
            style={{ width: '100%' }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            placeholder='Lựa chọn nhóm'
            treeDefaultExpandAll
            onChange={onChange}
          />
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center align-items-center'>
          <Button
            className='btn-sm btn-success rounded-1 p-2 ms-2'
            onClick={onFinish}
          >
            <i className='fa fa-save'></i>
            Đồng ý
          </Button>
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <Button
            className='btn-sm btn-secondary rounded-1 p-2 ms-2'
            onClick={handleCancel}
          >
            <i className='fa fa-times'></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
