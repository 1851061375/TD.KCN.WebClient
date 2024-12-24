import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Form, Input, Select, Spin, Checkbox, InputNumber, TreeSelect, SelectProps } from 'antd';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { removeAccents } from '@/utils/utils';
import * as actionsGlobal from '@/redux/global/Actions';
import * as actionsModal from '@/redux/modal/Actions';
import { requestGET, requestPOST, requestPUT } from '@/utils/baseAPI';
import { TDSelect } from '@/app/components';
import { AppDispatch, RootState } from '@/redux/Store';
import { IChiTieuBaoCaoDto, IDonViTinhDto, IPaginationResponse, IResult } from '@/models';
import { LOAI_CHI_TIEU } from '@/data';

const FormItem = Form.Item;

export const ReportMetricDetailModal = props => {
  const dispatch: AppDispatch = useDispatch();

  const dataModal = useSelector((state: RootState) => state.modal.treeData) as IChiTieuBaoCaoDto | null;
  const modalTree = useSelector((state: RootState) => state.modal.modalTree) as unknown as { visible: boolean, type: string };;

  const id =
    modalTree?.type == 'edit-group'
      ? dataModal?.id ?? null
      : modalTree?.type == 'chitiet'
        ? dataModal?.id ?? null
        : null;

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [chiTieuChaId, setChiTieuChaId] = useState<string | null>(null);

  const nest = (items, id = null, link = "chiTieuChaId") =>
    items
      .filter((item) => item[link] === id)
      .map((item) => ({
        ...item,
        title: item.ten,
        key: item.ma,
        value: item.id,
        children: nest(items, item.id),
      }));

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await requestPOST<IPaginationResponse<IChiTieuBaoCaoDto[]>>('api/v1/chitieubaocaos/search', {
        pageNumber: 1,
        pageSize: 1000,
        orderBy: ["thuTu"],
      });

      if (response.data) {
        const { data } = response.data;
        let tmp = nest(data ?? []);
        setTreeData(tmp);
      } else {
        setTreeData([]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      setTreeData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => { };
  }, []);

  useEffect(() => {
    if (modalTree.type == 'add-subgroup' && dataModal?.id) {
      setChiTieuChaId(dataModal?.id ?? null);
    }
    return () => { };
  }, [modalTree?.type, dataModal?.id]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IChiTieuBaoCaoDto>>(`api/v1/chitieubaocaos/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data) {
          _data.donViTinh = _data.donViTinhId ? { label: _data.donViTinhTen, value: _data.donViTinhId } : null;
          form.setFieldsValue(_data);
          //setChiTieuChaId(_data?.chiTieuChaId);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchData();
    } else {
      form.setFieldsValue({ chiTieuChaId: chiTieuChaId });
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (chiTieuChaId)
      form.setFieldsValue({ chiTieuChaId: chiTieuChaId })
  }, [chiTieuChaId]);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalTree({ visible: false, type: null }));
  };


  const onFinish = async () => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const formData: IChiTieuBaoCaoDto = {
        ...values,
        ...(id && { id }),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/chitieubaocaos/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/chitieubaocaos`, formData);

      if (response?.status == 200) {
        toast.success(id ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
        dispatch(actionsModal.setTreeData(formData));
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
      show={modalTree?.visible}
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
            <Form form={form} initialValues={{ layDuLieu: true, suDung: true }} layout="vertical" autoComplete="off">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thứ tự" name="thuTu" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <InputNumber placeholder="" min={0} max={1000} style={{ width: '100%' }} />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tên" name="ten" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mã" name="ma" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Chỉ tiêu cha" name="chiTieuChaId">
                    <TreeSelect
                      disabled={(chiTieuChaId && !id) ? true : false}
                      allowClear
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={treeData}
                      placeholder="Lựa chọn nhóm"
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Loại chỉ tiêu" name="loaiChiTieu" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Select
                      showSearch
                      placeholder="Chọn"
                      filterOption={(input, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {LOAI_CHI_TIEU.map((item: any) => {
                        return (
                          <Select.Option key={item.id} value={item.id}
                          >
                            {item.name}
                          </Select.Option >
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Đơn vị tính" name="donViTinh">
                    <TDSelect
                      showSearch
                      placeholder="Chọn"
                      fetchOptions={async keyword => {
                        const res = await requestPOST<IPaginationResponse<IDonViTinhDto[]>>(`api/v1/donvitinhs/search`, {
                          pageNumber: 1,
                          pageSize: 1000,
                          advancedSearch: {
                            fields: ['name'],
                            keyword: keyword || null,
                          },
                        });
                        return (
                          res.data?.data?.map(item => ({
                            ...item,
                            label: item?.ten,
                            value: item?.id,
                          })) ?? []
                        );
                      }}
                      onChange={(value, current: any) => {
                        if (value) {
                          form.setFieldsValue({
                            donViTinhId: current.value,
                          });
                        } else {
                          form.setFieldsValue({
                            donViTinhId: null,
                          });
                        }
                      }}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label=" " name="layDuLieu" valuePropName="checked">
                    <Checkbox>Có lấy giá trị</Checkbox>
                  </FormItem>
                </div>
                {/* <div className="col-xl-6 col-lg-6">
                  <FormItem label=" " name="suDung" valuePropName="checked">
                    <Checkbox>Sử dụng</Checkbox>
                  </FormItem>
                </div> */}
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <Button className="btn-sm btn-success rounded-1 py-2 px-5 ms-2" onClick={onFinish} disabled={buttonLoading}>
            <i className="fa fa-save me-2"></i>
            {id ? 'Lưu' : 'Tạo mới'}
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Button className="btn-sm btn-secondary rounded-1 p-2 ms-2" onClick={handleCancel}>
            <i className="fa fa-times me-2"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
