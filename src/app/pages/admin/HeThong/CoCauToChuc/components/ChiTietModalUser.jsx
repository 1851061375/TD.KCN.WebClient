import React, { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Form, Input, Select, Spin, notification, DatePicker } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Tree } from 'antd';
import * as actionsModal from '@/redux/modal/Actions';
import { requestPOST, requestGET, requestPUT, FILE_URL } from '@/utils/baseAPI';
//import { handleImage } from 'src/utils/utils';
import ImageUpload from '@/app/components/ImageUpload';
import * as authHelper from '@/app/modules/auth/core/AuthHelpers';
import { TreeSelect } from 'antd';
import { useAuth } from '@/app/modules/auth';

const FormItem = Form.Item;

const { Option } = Select;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { token } = authHelper.getAuth();
  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const random = useSelector((state) => state.modal.randomUsers);
  const id = dataModal?.id ?? null;
  const [organizationUnitName, setOrganizationUnitName] = useState('');
  const [treeData, setTreeData] = useState([]);
  //const isread = dataModal?.readOnly ?? null;

  //const API_URL_FILE = process.env.REACT_APP_API_URL_FILE + '/documentattachments/';

  const [form] = Form.useForm();
  const { currentUser } = useAuth();
  const genders = [
    { id: 'Nam', name: 'Nam' },
    { id: 'Nữ', name: 'Nữ' },
    { id: 'Khác', name: 'Khác' },
  ];

  const [loadding, setLoadding] = useState(false);
  const [image, setImage] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [lstDonVi, setLstDonVi] = useState([]);
  const [lstChucVu, setLstChucVu] = useState([]);
  const [positionName, setPositionName] = useState('');
  const url = 'https://minioapi.hanhchinhcong.net/';

  useEffect(() => {
    const fetchData = async () => {
      // var bodyDonVi = { "advancedSearch": { "fields": ["name", "shortName", "code"], "keyword": null }, "pageNumber": 1, "pageSize": 1000, "orderBy": ["createdOn DESC"] }
      // var dataDonViTemp = await requestPOST(`api/v1/organizationunits/getdonvi`, bodyDonVi);
      // var dataDonVi = dataDonViTemp?.data?.data ?? [];
      // setLstDonVi(dataDonVi)

      var bodyChucVu = { "advancedSearch": { "fields": ["name", "shortName", "code"], "keyword": null }, "pageNumber": 1, "pageSize": 1000, "orderBy": ["createdOn DESC"] }
      var dataChucVuTemp = await requestPOST(`api/v1/chucvus/search`, bodyChucVu);
      var dataChucVu = dataChucVuTemp?.data?.data ?? [];
      setLstChucVu(dataChucVu)

    };
    fetchData()

    return () => {
    }
  }, [])

  // cây đơn vị
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadding(true);

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

        setLoadding(false);
      } catch (error) {
        console.error('Error fetching tree data:', error);
        setLoadding(false);
      }
    };

    fetchData();
  }, [currentUser?.organizationUnitId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/users/${id}`);
      if (res) {
        form.setFieldsValue(res.data);
        const existingImageUrl = res.data?.imageUrl
          ? [
            {
              uid: '-1',
              name: 'Ảnh hiện tại',
              status: 'done',
              url: `${url}${res.data?.imageUrl}`,
            },
          ]
          : [];
        setImage(existingImageUrl);
        setPositionName(res.data.positionName);
        setOrganizationUnitName(res.data.organizationUnitName);
      }
      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => { };
  }, [random, id]);

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    dispatch(actionsModal.setModalVisible(false));
  };

  const onChange = (value, labelList, extra) => {
    debugger
    form.setFieldsValue({ organizationUnitId: value }); // Lưu key vào form
    const selectedNode = extra?.triggerNode.props;
    const level = selectedNode?.level;
    form.setFieldsValue({ level: level });
    setOrganizationUnitName(selectedNode?.name || ''); // Lấy title của node
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    setButtonLoading(true);
    try {
      const formData = form.getFieldsValue(true);
      formData.type = 1;

      if (id) {
        formData.id = id;
      }

      if (image.length > 0) {
        let uploadedImageUrl = image[0]?.response?.data[0]?.url || image[0]?.url || null;
        if (uploadedImageUrl?.startsWith(url)) {
          uploadedImageUrl = uploadedImageUrl.replace(url, ''); // Loại bỏ base URL
        }
        formData.imageUrl = uploadedImageUrl;
      } else {
        formData.imageUrl = null;
      }
      formData.organizationUnitName = organizationUnitName;
      formData.positionName = positionName;
      const res = id ? await requestPUT(`api/users/${id}`, formData) : await requestPOST(`api/users/byAdmin`, formData);
      if (res.status === 200) {
        toast.success('Cập nhật thành công!');
        props.setUpdate(!props.update);
        dispatch(actionsModal.setRandom());
        dispatch(actionsModal.setRandomUsers());
        handleCancel();
      } else {
        //toast.error('Thất bại, vui lòng thử lại!');
        const errors = Object.values(res?.data?.errors ?? {});
        let final_arr = [];
        errors.forEach((item) => {
          final_arr = _.concat(final_arr, item);
        });
        console.log(final_arr);
        toast.error('Thất bại, vui lòng thử lại! ' + final_arr.join(' '));
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
    setButtonLoading(false);
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
        <Modal.Title className='text-white'>Chi tiết người dùng</Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={form} layout='vertical' /* initialValues={initData} */ autoComplete='off'>
              <div className='row '>
                <div className='col col-xl-4'>
                  <ImageUpload
                    multiple={false}
                    URL={`${FILE_URL}api/v1/attachments/public`}
                    headers={{
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    }}
                    fileList={image}
                    defaultFileList={image}
                    onChange={(e) => {
                      setImage(e.fileList);
                    }}
                  />
                </div>
                <div className='col col-xl-4'>
                  <div className='row'>
                    <div className='col-xl-12'>
                      <FormItem
                        label='Tên đăng nhập'
                        name='userName'
                        rules={[
                          { required: true, message: 'Không được để trống!' },
                          {
                            pattern: /^[a-z0-9_.]{5,50}$/,
                            message: 'Tên đăng nhập tối thiểu 5 ký tự và tối đa 50 ký tự! Vui lòng kiểm tra lại!',
                          },
                        ]}
                      >
                        <Input placeholder='Tên đăng nhập' disabled={id ? true : false} />
                      </FormItem>
                    </div>
                    <div className='col-xl-12'>
                      <FormItem label='Họ và tên' name='fullName' rules={[{ required: true, message: 'Không được để trống!' }]}>
                        <Input placeholder='Họ và tên' />
                      </FormItem>
                    </div>
                  </div>
                </div>
                <div className='col col-xl-4'>
                  {/* <div className='row'></div> */}
                  <div className='row'>

                    <div className='col-xl-12'>
                      <Form.Item label='Đơn vị' name='organizationUnitId' rules={[{ required: true, message: 'Không được để trống!' }]}>
                        <TreeSelect
                          style={{ width: '100%' }}
                          // value={value}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          treeData={treeData}
                          placeholder='Lựa chọn đơn vị'
                          treeDefaultExpandAll
                          onChange={onChange}
                        />
                      </Form.Item>
                    </div>

                    <div className='col-xl-12'>
                      <Form.Item
                        label='Chức vụ'
                        name='positionId'
                        rules={[{ required: true, message: 'Không được để trống!' }]}
                      >
                        <Select placeholder='Chức vụ'
                          showSearch
                          filterOption={(input, option) =>
                            option?.children?.toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(value, option) => {
                            setPositionName(option?.children);  
                          }}>
                          {lstChucVu?.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.tenChucVu}
                              </Option>
                            )
                          })}
                        </Select>
                      </Form.Item>
                    </div>

                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-4 col-lg-6'>
                  <FormItem
                    label='Số điện thoại'
                    name='phoneNumber'
                    rules={[
                      // {required: true, message: 'Không được để trống!'},
                      {
                        pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
                        message: 'Chưa đúng định dạng của số điện thoại! Vui lòng kiểm tra lại!',
                      },
                    ]}
                  >
                    <Input placeholder='' />
                  </FormItem>
                </div>
                <div className='col-xl-4 col-lg-6'>
                  <FormItem
                    label='Email'
                    name='email'
                    rules={[
                      { required: true, message: 'Không được để trống!' },
                      {
                        pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Chưa đúng định dạng email! Vui lòng kiểm tra lại!',
                      },
                    ]}
                  >
                    <Input placeholder='' />
                  </FormItem>
                </div>
                <div className='col-xl-4 col-lg-6'>
                  <FormItem label='Giới tính' name='gender'>
                    <Select
                      showSearch
                      placeholder='Giới tính'
                      filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {genders.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          {<Button className='btn-sm btn-success rounded-1 p-2  ms-2' onClick={onFinish} disabled={buttonLoading}>
            <i className='fa fa-save'></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>}
        </div>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-secondary rounded-1 p-2  ms-2' onClick={handleCancel} disabled={buttonLoading}>
            <i className='fa fa-times'></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
