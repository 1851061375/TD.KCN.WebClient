import { FC, useState, useEffect } from 'react';
import { useAuth } from '@/app/modules/auth';
import { requestPOST, requestPUT } from '@/utils/baseAPI';
import { EditOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Select, Spin, DatePicker, Checkbox, Tabs, Divider } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import clsx from 'clsx';
const { TabPane } = Tabs;
interface ApiResponse {
  message: string | null;
  error: string | null;
  succeeded: boolean | null;
}
export const UserProfileModal: FC = () => {
  const [form] = Form.useForm();
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const colors = [
    'primary', 'success', 'info', 'warning', 'danger',
    'secondary', 'light', 'dark',
  ];
  const url = 'https://minioapi.hanhchinhcong.net/';
  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({ currentUser });
    }
  }, [currentUser]);

  const getRandomColor = (name) => {
    if (!name) return 'secondary'; 
    const firstLetter = name[0].toUpperCase(); 
    const alphabetIndex = firstLetter.charCodeAt(0) - 65; 
    const colorIndex = (alphabetIndex >= 0 && alphabetIndex < colors.length)
      ? alphabetIndex % colors.length 
      : 0; 
    return colors[colorIndex];
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    const userId = currentUser?.id;
    const updatedValues = {
      password: values?.password,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmNewPassword,
    };
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận không khớp!');
      return;
    }

    const res = await requestPOST<ApiResponse>(`api/users/change-password?userId=${userId}`, updatedValues);

    if (res.data?.message === "Password changed successfully") {
      logout();
      toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại!');
    } else {
      toast.error(res.data?.error);
    }
  };

  const handleSaveInfo = async () => {
    try {
      const values = await form.validateFields();
      const userId = currentUser?.id;
      const updatedValues = {
        ...currentUser, // Lấy tất cả giá trị từ currentUser
        ...values,     // Ghi đè các giá trị từ form
        id: userId,    // Đảm bảo ID được set đúng
      };
      const res = await requestPUT<ApiResponse>(`api/users/${userId}`, updatedValues);

      if (res.data?.message === "Update user successfully.") {
        toast.success('Cập nhật thông tin thành công!');
        setIsEditing(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(res.data?.error);
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi cập nhật thông tin!');
    }
  };

  return (
    <div className="user-profile-modal" style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: '25%', backgroundColor: '#ffff', padding: '20px', borderRight: '1px solid #000', }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="symbol symbol-circle symbol-100px overflow-hidden" style={{ margin: '0 auto' }}>
            <a href="#">
              {currentUser?.imageUrl ? (
                // Load ảnh từ URL
                <div className="symbol-label">
                  <img
                    src={`${url}${currentUser?.imageUrl}`}
                    alt={currentUser?.fullName || 'Avatar'}
                    className="w-100 h-100 object-fit-cover"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ) : (
                // Hiển thị biểu tượng mặc định nếu không có ảnh
                <div
                  className={clsx(
                    'symbol-label  bg-light',
                    `text-${getRandomColor(currentUser?.fullName)}`
                  )}
                  style={{ lineHeight: '100px', fontSize: '48px', fontWeight: 'bold' }} 
                >
                  {currentUser?.fullName ? currentUser?.fullName[0] : 'U'}
                </div>
              )}
            </a>
          </div>
          <h3 style={{ marginTop: '10px' }}>{currentUser?.fullName || 'Quản trị hệ thống'}</h3>
          <p>{currentUser?.email || 'admin.csdl'}</p>
        </div>
        <div>
          {/* <p style={{ marginBottom: '10px', fontWeight: activeTab === 'info' ? 'bold' : 'normal', cursor: 'pointer' }} onClick={() => setActiveTab('info')}>
            Hồ sơ cá nhân
          </p> */}
          {/* <p style={{ marginBottom: '10px', fontWeight: activeTab === 'activity' ? 'bold' : 'normal', cursor: 'pointer' }}>
            Hoạt động
          </p>
          <p style={{ marginBottom: '10px', fontWeight: activeTab === 'notifications' ? 'bold' : 'normal', cursor: 'pointer' }}>
            Thông báo
          </p> */}
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Tabs
          defaultActiveKey="1" // Mở Tab "Thông tin" mặc định
          type="card" // Hiển thị tab dạng card
          size="small" // Kích thước nhỏ
        >
          <TabPane tab="Thông tin" key="1">
            <div className="user-info">
              <Form layout="vertical" form={form} initialValues={currentUser}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Thông tin cá nhân</h3>
                  {!isEditing && (
                    <Tooltip title="Sửa">
                      <Button className="btn-sm btn-primary rounded-1 p-2 ms-2" onClick={() => setIsEditing(true)}>
                        <i className="fa fa-edit"></i>
                        {'Sửa'}
                      </Button>
                    </Tooltip>

                  )}
                </div>

                <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                  <Input disabled={!isEditing} />
                </Form.Item>
                {/* <Form.Item label="Ngày sinh" name="birthDate"> 
                  <Input disabled={!isEditing} />
                </Form.Item> */}
                <Form.Item label="Số điện thoại" name="phoneNumber">
                  <Input disabled={!isEditing} />
                </Form.Item>

                {isEditing && (
                  <Form.Item>
                    <div className="d-flex justify-content-end align-items-center me-3">
                      <Button className="btn-sm btn-success rounded-1 p-2 ms-2 " onClick={handleSaveInfo}>
                        <i className="fa fa-save"></i>
                        {'Lưu lại'}
                      </Button>
                      <Button className="btn-sm btn-secondary rounded-1 p-2 ms-2" onClick={() => setIsEditing(false)}>
                        <i className="fa fa-times"></i>
                        {'Hủy'}
                      </Button>
                    </div>
                  </Form.Item>
                )}
              </Form>
            </div>
          </TabPane>

          <TabPane tab="Đổi mật khẩu" key="2">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Mật khẩu hiện tại"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                {
                  pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                  message: 'Mật khẩu từ 6-18 ký tự, gồm có: chữ hoa hoặc chữ thường hoặc số và các ký tự đặc biệt! Vui lòng kiểm tra lại!',
                },]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmNewPassword"
                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },

                {
                  pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                  message: 'Mật khẩu từ 6-18 ký tự, gồm có: chữ hoa hoặc chữ thường hoặc số và các ký tự đặc biệt! Vui lòng kiểm tra lại!',
                },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <div className="d-flex justify-content-end align-items-center">
                  <Button className="btn-sm btn-success rounded-1 p-2 ms-2" onClick={onFinish} >
                    <i className="fa fa-save"></i>
                    Đổi mật khẩu
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
