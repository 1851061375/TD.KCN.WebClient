import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Spin } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { requestGET, requestPUT } from '@/utils/baseAPI';
import { IUserDetails } from '@/models/User';
import { IGroupPermission, IPermissionResponse, IResult } from '@/models';

import { RootState } from '@/redux/RootReducer';
import { AppDispatch } from '@/redux/Store';
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';

interface PermissionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const PermissionModal = ({ visible, setVisible }: PermissionModalProps) => {
  const dispatch: AppDispatch = useDispatch();
  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IUserDetails | null;
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loadding, setLoadding] = useState(false);

  const [permissionGroups, setPermissionGroups] = useState<IGroupPermission[]>([]);

  const fetchPermissions = useCallback(async () => {
    setLoadding(true);
    try {
      const endpoint = id ? `api/users/${id}/permissions` : 'api/permissions/group';
      const res = await requestGET<IPermissionResponse>(endpoint);

      if (res.data) {
        if (id) {
          form.setFieldsValue(res.data);
        }
        setPermissionGroups(res.data?.groups ?? []);
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu quyền');
    } finally {
      setLoadding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
    setVisible(false);
  };

  const onChangePermission = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setPermissionGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        permissions: group.permissions.map(permission => (permission.value === value ? { ...permission, active: checked } : permission)),
      }))
    );
  }, []);

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      const values = await form.validateFields();

      const permissions = permissionGroups
        .flatMap(group => group.permissions)
        .filter(permission => permission.active)
        .map(permission => permission.value);

      const formData = {
        ...values,
        ...(id && { id }),
        permissions: permissions,
        groups: null,
      };

      const response = await requestPUT<IResult<string>>(`api/users/${id}/permissions`, formData);
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

  const renderPermissionGroup = useCallback(
    (group: IGroupPermission) => (
      <div className="mb-3" key={group.section}>
        <p className="fw-bold">{group.section}</p>
        <div className="row">
          {group.permissions.map(permission => (
            <div className="col-3 mb-1" key={permission.value}>
              <div className="d-flex align-items-center">
                <input
                  name="permissions"
                  type="checkbox"
                  id={permission.value}
                  value={permission.value}
                  checked={permission.active}
                  className="me-2"
                  onChange={onChangePermission}
                />
                <label htmlFor={permission.value}>{permission.description}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    [onChangePermission]
  );

  return (
    <Modal show={visible} fullscreen size="xl" onExited={handleCancel} keyboard scrollable onEscapeKeyDown={handleCancel}>
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">{'Khôi phục mật khẩu'}</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel} />
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <Form form={form} layout="vertical" autoComplete="off">
              <div className="row">
                <div className="col-xl-12 col-lg-12 mt-4">
                  <div className="card card-xl-stretch">
                    <div className="card-header">
                      <div className="card-title fw-bold text-header-td fs-4 mb-0">Danh sách quyền</div>
                    </div>
                    <div className="card-body">{permissionGroups.map(renderPermissionGroup)}</div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-primary rounded-1 py-2 px-5  ms-2" onClick={onFinish} disabled={buttonLoading}>
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

export default PermissionModal;
