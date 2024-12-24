import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { RootState } from '@/redux/RootReducer';
import { requestPOST } from '@/utils/baseAPI';
import { IUserDetails } from '@/models/User';
import { IResult } from '@/models';

import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';

import { AppDispatch } from '@/redux/Store';

interface ResetPasswordModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface FormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordModal = ({ visible, setVisible }: ResetPasswordModalProps) => {
  const dispatch: AppDispatch = useDispatch();
  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IUserDetails | null;

  const userName = dataModal?.userName ?? null;

  const [form] = Form.useForm<FormValues>();
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
    setVisible(false);
  };

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      const values = await form.validateFields();

      const formData = {
        ...values,
        ...(userName && { userName }),
      };

      const response = await requestPOST<IResult<string>>(`api/users/admin-reset-password`, formData);
      if (response?.status == 200) {
        toast.success('Cập nhật thành công!');
        dispatch(actionsGlobal.setRandom());
        handleCancel();
      } else {
        toast.error(response?.data?.message || 'Thao tác thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      toast.error('Thao tác thất bại, vui lòng thử lại!');
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Modal show={visible} fullscreen={'lg-down'} size="xl" onExited={handleCancel} keyboard={true} scrollable={true} onEscapeKeyDown={handleCancel}>
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">{'Khôi phục mật khẩu'}</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Form<FormValues> form={form} layout="vertical" autoComplete="off">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  { required: true, message: 'Không được để trống!' },
                  {
                    pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                    message: 'Mật khẩu từ 6-18 ký tự, gồm có: chữ hoa hoặc chữ thường và các ký tự đặc biệt! Vui lòng kiểm tra lại!',
                  },
                ]}
              >
                <Input placeholder="" type={'password'} />
              </Form.Item>
            </div>

            <div className="col-xl-12 col-lg-12">
              <Form.Item
                label="Nhập lại mật khẩu mới"
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Không được để trống!' },
                  ({ getFieldValue }) => ({
                    validator(_, value: string) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                    },
                  }),
                  {
                    pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                    message: 'Mật khẩu từ 6-18 ký tự, gồm có: chữ hoa hoặc chữ thường và các ký tự đặc biệt! Vui lòng kiểm tra lại!',
                  },
                ]}
              >
                <Input placeholder="" type={'password'} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-primary rounded-1 p-2  ms-2" onClick={onFinish} active={!buttonLoading}>
            <i className="fa fa-save me-2" />
            Đổi mật khẩu
          </Button>
        </div>
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 p-2  ms-2" onClick={handleCancel}>
            <i className="fa fa-times me-2" />
            Huỷ
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ResetPasswordModal;
