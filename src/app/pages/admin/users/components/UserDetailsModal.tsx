import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Select, Spin, DatePicker, Checkbox } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { handleFiles, handleImage } from '@/utils/utils';
import { getAuth } from '@/app/modules/auth/core/AuthHelpers';
import { RootState } from '@/redux/RootReducer';
import { FILE_URL, requestGET, requestPOST, requestPUT } from '@/utils/baseAPI';
import { IUserDetails } from '@/models/User';
import { IResult } from '@/models';

import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';

import { AppDispatch } from '@/redux/Store';
import { TDUploadFile } from '@/models/TDUploadFile';
import { ImageUpload } from '@/app/components';

const FormItem = Form.Item;

const UserDetailsModal = props => {
  const dispatch: AppDispatch = useDispatch();
  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IUserDetails | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const [image, setImage] = useState<TDUploadFile[]>([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IUserDetails>(`api/users/${id}`);
        const _data = response?.data ?? null;
        if (_data) {
          _data.dateOfBirth = _data?.dateOfBirth ? dayjs(_data?.dateOfBirth) : null;
          form.setFieldsValue(_data);
          setImage(handleImage(_data?.imageUrl ?? '', FILE_URL));
        }
      } catch (error) {
        console.error('Error fetching organization unit:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      const values = await form.validateFields();
      const imageUrls = handleFiles(image);
      const formData: IUserDetails = {
        ...values,
        ...(id && { id }),
        imageUrl: imageUrls.join('##'),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/users/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/users`, formData);

      if (response?.status == 200) {
        toast.success(id ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        dispatch(actionsGlobal.setRandom());
        handleCancel();
      } else {
        toast.error(response?.data?.message || 'Thao tác thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Modal
      show={modalVisible}
      fullscreen={'lg-down'}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">{id ? 'Chi tiết' : 'Thêm mới'}</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <Form form={form} layout="vertical" autoComplete="off">
              <div className="row ">
                <div className="col col-xl-4">
                  <FormItem label="Ảnh đại diện">
                    <ImageUpload URL={`${FILE_URL}/api/v1/attachments/public`} fileList={image} onChange={e => setImage(e.fileList)} />
                  </FormItem>
                </div>
                <div className="col col-xl-8">
                  <div className="row">
                    <div className="col-xl-12">
                      <FormItem label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Không được để trống!' }]}>
                        <Input placeholder="Họ và tên" />
                      </FormItem>
                    </div>
                    <div className="col-xl-6">
                      <FormItem label="Giới tính" name="gender">
                        <Select placeholder="Giới tính">
                          <Select.Option value="Nam">Nam</Select.Option>
                          <Select.Option value="Nữ">Nữ</Select.Option>
                          <Select.Option value="Khác">Khác</Select.Option>
                        </Select>
                      </FormItem>
                    </div>
                    <div className="col-xl-6">
                      <FormItem label="Ngày sinh" name="dateOfBirth">
                        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-lg-6">
                  <FormItem
                    label="Số điện thoại liên hệ"
                    name="phoneNumber"
                    rules={[
                      // {required: true, message: 'Không được để trống!'},
                      {
                        pattern: /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
                        message: 'Chưa đúng định dạng của số điện thoại! Vui lòng kiểm tra lại!',
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <FormItem
                    label="Email liên hệ"
                    name="email"
                    rules={[
                      // {required: true, message: 'Không được để trống!'},
                      {
                        pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Chưa đúng định dạng email! Vui lòng kiểm tra lại!',
                      },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                </div>

                <div className="col-xl-4 col-lg-6">
                  <FormItem label="Địa chỉ" name="address">
                    <Input placeholder="Địa chỉ" />
                  </FormItem>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <FormItem label="Email/Số điện thoại đăng nhập" name="userName" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="Tên tài khoản" autoComplete="" />
                  </FormItem>
                </div>
                {id ? (
                  <></>
                ) : (
                  <>
                    <div className="col-xl-4 col-lg-6">
                      <FormItem label="Mật khẩu" name="password" rules={[{ required: true, message: 'Không được để trống!' }]}>
                        <Input.Password
                          placeholder="Mật khẩu"
                          size="small"
                          iconRender={visible =>
                            visible ? (
                              <div className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1">
                                <i className="fa fa-eye"></i>
                              </div>
                            ) : (
                              <div className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1">
                                <i className="fa fa-eye-slash"></i>
                              </div>
                            )
                          }
                        />
                      </FormItem>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <FormItem
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                          { required: true, message: 'Không được để trống!' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('Không khớp với mật khẩu đã nhập!'));
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          size="small"
                          placeholder="Nhập lại mật khẩu"
                          iconRender={visible =>
                            visible ? (
                              <div className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1">
                                <i className="fa fa-eye"></i>
                              </div>
                            ) : (
                              <div className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1">
                                <i className="fa fa-eye-slash"></i>
                              </div>
                            )
                          }
                        />
                      </FormItem>
                    </div>
                  </>
                )}
                <div className="col-xl-4 col-lg-6">
                  <FormItem label=" " name="isSpecial" valuePropName="checked">
                    <Checkbox>Là người dùng đặc biệt</Checkbox>
                  </FormItem>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <FormItem label=" " name="isDev" valuePropName="checked">
                    <Checkbox>Là người dùng DEV</Checkbox>
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-primary rounded-1 p-2  ms-2" onClick={onFinish} disabled={buttonLoading}>
            <i className="fa fa-save"></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 p-2  ms-2" onClick={handleCancel} disabled={buttonLoading}>
            <i className="fa fa-times"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
