import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input, Spin, InputNumber, Checkbox } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { requestPOST, requestGET, requestPUT, FILE_URL, API_URL } from '@/utils/baseAPI';
import { AppDispatch, RootState } from '@/redux/Store';
import { IOrganizationUnitDetails, IResult } from '@/models';
import * as actionsOrganizationUnit from '@/redux/organization-unit/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { ImageUpload } from '@/app/components';
import { handleFiles, handleImage } from '@/utils/utils';
import { TDUploadFile } from '@/models/TDUploadFile';
const FormItem = Form.Item;

const { TextArea } = Input;

const ModalOrganizationUnitDetail = props => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm<IOrganizationUnitDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [logo, setLogo] = useState<TDUploadFile[]>([]);

  const modalState = useSelector((state: RootState) => state.organizationUnit.modalState);

  const id = modalState?.type === 'edit' ? modalState?.modalData?.id : null;
  const parentId = modalState?.type === 'createChild' ? modalState?.modalData?.id : null;

  const [file, setFile] = useState([]);

  const [loadding, setLoadding] = useState(false);

  useEffect(() => {
    const fetchOrganizationUnit = async (): Promise<void> => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IOrganizationUnitDetails>>(`api/v1/organizationunits/${id}`);

        if (response?.data?.data) {
          form.setFieldsValue(response.data.data);
          setLogo(handleImage(response.data.data?.logo ?? '', FILE_URL));
        }
      } catch (error) {
        console.error('Error fetching organization unit:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationUnit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsOrganizationUnit.setModalVisible({ modalVisible: false, type: null, modalData: null }));
  };

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const logoUrls = handleFiles(logo);
      const formData: IOrganizationUnitDetails = {
        ...values,
        ...(id && { id }),
        ...(parentId && { parentId }),
        logo: logoUrls.join('##'),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/organizationunits/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/organizationunits`, formData);
      if (response?.data?.succeeded) {
        toast.success(id ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        dispatch(actionsGlobal.setRandom());
        handleCancel();
      } else {
        toast.error(response?.data?.message || 'Thao tác thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Modal
      show={modalState?.modalVisible}
      fullscreen={'lg-down'}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Chi tiết</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={form} layout="vertical" /* initialValues={initData} */ autoComplete="off">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tên đơn vị" name="name" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tên tắt" name="shortcutName">
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mã định danh đơn vị" name="code" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                {/* <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Loại nhóm' name='type'>
                    <Input placeholder='' />
                  </FormItem>
                </div> */}
                {/*  <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Địa bàn' name='areaId'>
                    <Input placeholder='' />
                  </FormItem>
                </div> */}
                {/* <div className='col-xl-6 col-lg-6'>
                  <FormItem label='Thứ tự' name='order'>
                    <InputNumber placeholder='' style={{width: '100%'}} min={0} />
                  </FormItem>
                </div> */}
                <div className="col-xl-6 col-lg-6">
                  <FormItem label=" " name="isActive" valuePropName="checked">
                    <Checkbox>Hoạt động</Checkbox>
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mức độ ưu tiên" name="sortOrder">
                    <InputNumber placeholder="" min={0} max={1000} style={{ width: '100%' }} />
                  </FormItem>
                </div>
                <div className="col col-xl-12">
                  <FormItem label="Ảnh">
                    <ImageUpload URL={`${API_URL}/api/v1/attachments/public`} fileList={logo} onChange={e => setLogo(e.fileList)} />
                  </FormItem>
                </div>
                <div className="col-xl-12 col-lg-12">
                  <FormItem label="Thông tin giới thiệu" name="description">
                    <TextArea rows={4} placeholder="" />
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-primary rounded-1 p-2  ms-2" onClick={onFinish}>
            <i className="fa fa-save"></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 p-2  ms-2" onClick={handleCancel}>
            <i className="fa fa-times"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalOrganizationUnitDetail;
