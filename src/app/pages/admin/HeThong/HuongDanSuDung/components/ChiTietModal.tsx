import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Checkbox, Form, Input, InputNumber, Spin, DatePicker, Space } from 'antd';
import type { RadioChangeEvent, CheckboxProps, DatePickerProps } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { handleFiles, handleImage } from '@/utils/utils';
import * as actionsModal from '@/redux/modal/Actions';
import { RootState, AppDispatch } from '@/redux/Store';
import { IResult, IPaginationResponse } from '@/models';
import { TDUploadFile } from '@/models/TDUploadFile';
import { removeAccents } from '@/utils/utils';
import { TDSelect } from '@/app/components';
import { requestGET, requestPOST, FILE_URL } from '@/utils/baseAPI';
import { requestPUT } from '@/utils/baseAPI';
import * as actionsGlobal from '@/redux/global/Actions';
import { IHuongDanSuDung } from '@/models/HuongDanSuDung';
import { FileUpload } from '@/app/components';
import { getAuth } from '@/app/modules/auth/core/AuthHelpers';

const FormItem = Form.Item;

const ModalItem = props => {
  const dispatch: AppDispatch = useDispatch();
  const url = 'https://minioapi.hanhchinhcong.net/';
  const dataModal = useSelector((state: RootState) => state.modal.dataModal) as IHuongDanSuDung | null;
  const modalVisible = useSelector((state: RootState) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;
  const token = getAuth()?.token;
  const [form] = Form.useForm<IHuongDanSuDung>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [files, setFiles] = useState<TDUploadFile[]>([]);

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IHuongDanSuDung>>(`api/v1/huongdansudungs/${id}`);
        const _data = response?.data ?? null;
        setFiles(handleImage(_data?.data.dinhKem ?? '', url));
        if (_data) {
          form.setFieldsValue({
            ..._data.data,
          });
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
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);
      const imageUrls = handleFiles(files);
      const formData: IHuongDanSuDung = {
        ...values,
        ...(id && { id }),
        dinhKem: imageUrls.join('##'),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/huongdansudungs/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/huongdansudungs`, formData);

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
        <Modal.Title className="text-white">Chi tiết</Modal.Title>
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={handleCancel}></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <Form<IHuongDanSuDung> form={form} layout="vertical" /* initialValues={initData} */ autoComplete="off">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tên" name="ten" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mã" name="ma" rules={[{ required: true, message: 'Không được để trống!' }]} >
                    <Input placeholder="" />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mô tả" name="moTa">
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Đính kèm" name="dinhKem">
                    <FileUpload
                      multiple={false}
                      URL={`${FILE_URL}api/v1/attachments/public`}
                      headers={{
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      }}
                      fileList={files}
                      onChange={(e) => {
                        setFiles(e.fileList);
                      }}
                    />
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button className="btn-sm btn-success rounded-1 p-2  ms-2" onClick={onFinish} disabled={buttonLoading}>
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

export default ModalItem;
