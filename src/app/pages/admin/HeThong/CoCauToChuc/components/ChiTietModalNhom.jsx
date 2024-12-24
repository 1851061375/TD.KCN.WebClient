import React, {useState, useEffect, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {Form, Input, Select, Spin, DatePicker, InputNumber} from 'antd';
import {Modal, Button} from 'react-bootstrap';
import {toast} from 'react-toastify';

import * as actionsModal from '@/redux/modal/Actions';
import {requestPOST, requestGET, requestPUT, FILE_URL} from '@/utils/baseAPI';

const FormItem = Form.Item;

const {TextArea} = Input;
const {Option} = Select;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  //const token = useSelector((state) => state.auth.accessToken);

  const dataModal = useSelector((state) => state.modal.currentOrganizationUnit);
  console.log('dataModal', dataModal);
  const modalOrganizationUnit = useSelector((state) => state.modal.modalOrganizationUnit);

  const id = modalOrganizationUnit?.type == 'suanhom' ? dataModal?.id ?? null : null;
  const parentId = modalOrganizationUnit?.type == 'themnhomcon' ? dataModal?.id ?? null : null;
  const level =modalOrganizationUnit?.level;
  console.log('modalOrganizationUnit', modalOrganizationUnit);
  console.log('parentId', parentId);

  const [form] = Form.useForm();
  const [file, setFile] = useState([]);

  const [loadding, setLoadding] = useState(false);
  const [lstLoaiCoCauToChuc, setLstLoaiCoCauToChuc] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      var bodyLoaiCoCauToChuc = {
        advancedSearch: {fields: ['name', 'shortName', 'code'], keyword: null},
        pageNumber: 1,
        pageSize: 1000,
        orderBy: ['createdOn DESC'],
      };
      var dataLoaiCoCauToChucTemp = await requestPOST(`api/v1/loaicocautochucs/search`, bodyLoaiCoCauToChuc);
      var dataLoaiCoCauToChuc = dataLoaiCoCauToChucTemp.data?.data ?? [];
      setLstLoaiCoCauToChuc(dataLoaiCoCauToChuc);
    };
    fetchData();
    return () => {};
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/organizationunits/${id}`);

      if (res && res.data?.data) {
        form.setFieldsValue(res.data?.data);
      }
      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();

    dispatch(actionsModal.setModalOrganizationUnit({modalVisible: false, type: null}));
  };

  const onFinish = async () => {
    const values = await form.validateFields();

    try {
      let arrFile = [];
      file.forEach((i) => {
        if (i.response) {
          arrFile.push(i.response.data[0].url);
        } else {
          arrFile.push(i.path);
        }
      });
      form.setFieldsValue({file: arrFile.join('##')});
      const formData = form.getFieldsValue(true);
      if (id) {
        formData.id = id;
      }
      if (parentId) {
        formData.parentId = parentId;
      }
      if(level===null) formData.level=0;
      else formData.level=level+1;

      const res = id ? await requestPUT(`api/v1/organizationunits/${id}`, formData) : await requestPOST(`api/v1/organizationunits`, formData);
      if (res) {
        toast.success('Thành công!');
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
        toast.error('Thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Modal
      show={modalOrganizationUnit?.modalVisible}
      fullscreen={'lg-down'}
      size='xl'
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className='bg-primary px-4 py-3'>
        <Modal.Title className='text-white'>Chi tiết</Modal.Title>
        <button type='button' className='btn-close btn-close-white' aria-label='Close' onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form
              form={form}
              layout='vertical'
              initialValues={{
                thuTu: 1,
              }}
              autoComplete='off'
            >
              <div className='row'>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Tên' name='name' rules={[{required: true, message: 'Không được để trống!'}]}>
                    <Input placeholder='' />
                  </FormItem>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Mã' name='code' rules={[{required: true, message: 'Không được để trống!'}]}>
                    <Input placeholder='' />
                  </FormItem>
                </div>
                <div className='col-xl-6 col-lg-6'>
                  {/* <FormItem label='Loại nhóm' name='type'>
                    <Input placeholder='' />
                  </FormItem> */}

                  <Form.Item label='Phân loại' name='loaiCoCauToChucId' rules={[{required: true, message: 'Không được để trống!'}]}>
                    <Select placeholder='Phân loại'>
                      {lstLoaiCoCauToChuc?.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.tieuDe}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                {/*  <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Địa bàn' name='areaId'>
                    <Input placeholder='' />
                  </FormItem>
                </div> */}
                <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Thứ tự' name='order'>
                    <InputNumber placeholder='' style={{width: '100%'}} min={0} />
                  </FormItem>
                </div>

                <div className='col-xl-12 col-lg-12'>
                  <FormItem label='Mô tả' name='description'>
                    <TextArea rows={4} placeholder='' />
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-success rounded-1 p-2  ms-2' onClick={onFinish}>
            <i className='fa fa-save'></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-secondary rounded-1 p-2  ms-2' onClick={handleCancel}>
            <i className='fa fa-times'></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
