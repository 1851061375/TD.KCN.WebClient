/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useAuth } from '@/app/modules/auth';
import _ from 'lodash';
import * as actionsModal from '@/redux/modal/Actions';
import {toast} from 'react-toastify';
import {Dropdown, Menu, Tree, Modal, Table} from 'antd';
import { requestGET, requestDELETE, requestPOST} from '@/utils/baseAPI';
import ModalItem from './ChiTietModalNhom';
import ChiTietPermissionModal from './ChiTietPermissionModal';

const UsersList = () => {
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.modal.modalOrganizationUnit);
  const modalPermissionVisible = useSelector((state) => state.modal.modalPermissionVisible);
  const { currentUser } = useAuth();
  const random = useSelector((state) => state.modal.random);

  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [level, setLevel] = useState(0);

  const XoaNhom = async (idXoa) => {
    Modal.confirm({
      title: 'Xoá nhóm',
      content: 'Bạn có chắc chắn muốn xoá nhóm này?',
      okText: 'Đồng ý',
      cancelText: 'Huỷ',
      onOk: async () => {
        var res = await requestDELETE(`api/v1/organizationunits/${idXoa}`);
        if (res) {
          toast.success('Thao tác thành công!');
          dispatch(actionsModal.setCurrentOrganizationUnit(null));

          dispatch(actionsModal.setRandom());
        } else {
          toast.error('Thất bại, vui lòng thử lại!');
        }
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(`api/v1/organizationunits/gettree/search`, {
          advancedSearch: {
            fields: ['name', 'code'],
            keyword: null,
          },
          parentId:currentUser?.organizationUnitId ?? "",
          pageNumber: 1,
          pageSize: 100000,
          orderBy: ['name'],
        });       
        const nest = (items, id = null, link = 'parentId') =>
          items
            .filter((item) => item[link] === id)
            .map((item) => ({
              ...item,
              title: (
                <Dropdown
                  overlay={
                    <Menu
                      onClick={({key}) => {
                        switch (key) {
                          case 'suanhom':
                            dispatch(actionsModal.setModalOrganizationUnit({modalVisible: true, type: 'suanhom', level:item.level}));
                            break;
                          case 'themnhomcon':
                            dispatch(actionsModal.setModalOrganizationUnit({modalVisible: true, type: 'themnhomcon', level:item.level}));
                            break;
                          case 'xoanhom':
                            XoaNhom(item.id);
                            break;
                          case 'phanquyennhom':
                            dispatch(actionsModal.setDataModal({id: item.id}));
                            dispatch(actionsModal.setModalPermissionVisible(true));
                            break;
                          default:
                            break;
                        }
                      }}
                      items={[
                        {
                          label: 'Thêm nhóm con',
                          key: 'themnhomcon',
                        },
                        {
                          label: 'Sửa nhóm',
                          key: 'suanhom',
                        },
                        // {
                        //   label: 'Phân quyền nhóm',
                        //   key: 'phanquyennhom',
                        // },
                        {
                          label: 'Xoá nhóm',
                          key: 'xoanhom',
                        },
                      ]}
                    />
                  }
                  trigger={['contextMenu']}
                >
                  <div className='site-dropdown-context-menu'>{item.name}</div>
                </Dropdown>
              ),
              key: item.code,
              children: nest(items, item.id),
            }));
        let tmp = res.data?.data ?? [];
        console.log(tmp);
        tmp = convertToTreeData(tmp);
        setTreeData(tmp);
        console.log('tmp', tmp);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [random]);

  const handleButton = async (type, item) => {
    switch (type) {
      case 'chi-tiet':
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));

        break;
      case 'chi-tiet-quyen':
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalPermissionVisible(true));

        break;

      case 'delete':
        if (item.name === 'Basic' || item.name === 'Admin') {
          toast.error('Thất bại, đây là nhóm mặc định của hệ thống bạn không có quyền xoá');
          return;
        }

        var res = await requestDELETE(`api/roles/${item.id}`);

        if (res) {
          toast.success('Thao tác thành công!');
          dispatch(actionsModal.setRandom());
        } else {
          toast.error('Thất bại, vui lòng thử lại!');
        }
        break;
      case 'XoaVanBan':
        //handleXoaVanBan(item);
        break;

      default:
        break;
    }
  };

  const onSelect = (selectedKeys, info) => {
    dispatch(actionsModal.setCurrentOrganizationUnit({id: info?.node?.id, name: info?.node?.name, level: info?.node?.level}));
    console.log('selected', {id: info?.node?.id, name: info?.node?.name});
  };

  function convertToTreeData(data) {
    const map = {};
    const treeData = [];

    data.forEach((node) => {
      map[node.id] = {
        id: node.id,
        key: node.id,
        level: node.level,
        title: (
          <Dropdown
            overlay={
              <Menu
                onClick={({key}) => {
                  switch (key) {
                    case 'suanhom':
                      dispatch(actionsModal.setModalOrganizationUnit({modalVisible: true, type: 'suanhom', level:node.level}));
                      break;
                    case 'themnhomcon':
                      dispatch(actionsModal.setModalOrganizationUnit({modalVisible: true, type: 'themnhomcon', level:node.level}));
                      break;
                    case 'xoanhom':
                      XoaNhom(node.id);
                      break;
                    case 'phanquyennhom':
                      dispatch(actionsModal.setDataModal({id: node.id}));
                      dispatch(actionsModal.setModalPermissionVisible(true));
                      break;
                    default:
                      break;
                  }
                }}
                items={[
                  {
                    label: 'Thêm nhóm con',
                    key: 'themnhomcon',
                  },
                  {
                    label: 'Sửa nhóm',
                    key: 'suanhom',
                  },
                  // {
                  //   label: 'Phân quyền nhóm',
                  //   key: 'phanquyennhom',
                  // },
                  {
                    label: 'Xoá nhóm',
                    key: 'xoanhom',
                  },
                ]}
              />
            }
            trigger={['contextMenu']}
          >
            <div className='site-dropdown-context-menu'>{node.name}</div>
          </Dropdown>
        ),
        children: [],
      };
    });

    data.forEach((node) => {
      const parentNode = map[node.parentId];
      if (parentNode) {
        parentNode.children.push(map[node.id]);
      } else {
        treeData.push(map[node.id]);
      }
    });

    return treeData;
  }

  return (
    <>
      <div className='card-body card-dashboard px-3 py-3'>
        <div className='card-dashboard-body'>
          {/* <Table dataSource={dataTable} columns={columns} loading={loading} rowKey={Math.random().toString(32)} /> */}
          {loading ? (
            <div className='d-flex align-items-center justify-content-center p-5'>
              <span className='indicator-progress text-white d-block'>
                Đang lấy dữ liệu...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            </div>
          ) : (
            <Tree showLine defaultExpandAll treeData={treeData} onSelect={onSelect} />
          )}
        </div>
      </div>
      {modalVisible?.modalVisible ? <ModalItem /> : <></>}
      {modalPermissionVisible ? <ChiTietPermissionModal /> : <></>}
    </>
  );
};

export default UsersList;
