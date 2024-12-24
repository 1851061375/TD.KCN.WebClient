import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Form,
  Input,
  Select,
  Spin,
  Checkbox,
  InputNumber,
  Upload,
  Radio,
} from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import { removeAccents } from "@/utils/utils";
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import {
  requestGET,
  requestPOST,
  requestPUT,
} from "@/utils/baseAPI";
import { AppDispatch, RootState } from "@/redux/Store";
import { IBangTrongMauBaoCaoDto, ILoaiKyDuLieuDto, IPaginationResponse, IResult } from "@/models";
import { LOAI_CHI_TIEU, VI_TRI_DU_LIEU } from "@/data";
import { TDSelect } from "@/app/components";

const FormItem = Form.Item;

const TableDetailModal = () => {
  const dispatch: AppDispatch = useDispatch();
  const modalTableDetail = useSelector((state: RootState) => state.modal.modalTableDetail);
  const dataModal = modalTableDetail.bangTrongMauBaoCao;
  const id = dataModal?.id ?? null;
  const reportTemplateId = dataModal?.bieuMauBaoCaoId ?? null;

  const [form] = Form.useForm<IBangTrongMauBaoCaoDto>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [tableType, setTableType] = useState(0);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await requestGET<IResult<IBangTrongMauBaoCaoDto>>(`api/v1/bangtrongmaubaocaos/${id}`);
        const _data = response?.data?.data ?? null;
        if (_data && _data.loaiKyDuLieuIds) {
          const loaiKyDuLieuIds = _data.loaiKyDuLieuIds.split(',');
          _data.loaiKyDuLieu = await Promise.all(
            loaiKyDuLieuIds.map(async (item: string) => {
              const responseLoaiKyDuLieu = await requestGET<IResult<ILoaiKyDuLieuDto>>(`api/v1/loaikydulieus/${item}`);
              const _dataLoaiKyDuLieu = responseLoaiKyDuLieu?.data?.data ?? null;
              return {
                label: _dataLoaiKyDuLieu?.ten,
                value: _dataLoaiKyDuLieu?.id,
              };
            })
          );
          console.log(_data);
          setTableType(_data.loaiBang);
          form.setFieldsValue({
            ..._data,
            loaiKyDuLieu: _data.loaiKyDuLieu ?? [],
          });
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
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChangeTableType = (value: any) => {
    setTableType(value);
    if (value == 0)
      form.setFieldsValue({ viTriBatDau: VI_TRI_DU_LIEU.RIGHT });
    else if (value == 1)
      form.setFieldsValue({ viTriBatDau: VI_TRI_DU_LIEU.DOWN });
  }

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalTableDetail({ visible: false }));
  };

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      await form.validateFields();

      const values = form.getFieldsValue(true);

      const formData: IBangTrongMauBaoCaoDto = {
        ...values,
        loaiKyDuLieuIds: values.loaiKyDuLieu?.map((item: any) => item.value).join(),
        ...(id && { id }),
      };

      const response = id
        ? await requestPUT<IResult<string>>(`api/v1/bangtrongmaubaocaos/${id}`, formData)
        : await requestPOST<IResult<string>>(`api/v1/bangtrongmaubaocaos`, formData);

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
      show={modalTableDetail.visible || false}
      fullscreen={"lg-down"}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Chi tiết</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <Form<IBangTrongMauBaoCaoDto>
              form={form}
              initialValues={{
                suDung: true,
                bieuMauBaoCaoId: reportTemplateId,
              }}
              layout="vertical"
              autoComplete="off"
            >
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Thứ tự"
                    name="thuTu"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Tên"
                    name="ten"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input
                      placeholder=""
                      onInput={async (e) => {
                        form.setFieldValue(
                          "ma",
                          removeAccents((e.target as HTMLInputElement).value)
                        );
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Mã"
                    name="ma"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Loại bảng" name="loaiBang" rules={[{ required: true, message: 'Không được để trống!' }]}>
                    <Select
                      showSearch
                      placeholder="Chọn"
                      filterOption={(input, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onChange={(value) => handleChangeTableType(value)}
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

                {tableType == 0 && (
                  <div className="col-xl-6 col-lg-6">
                    <FormItem
                      label="Loại kỳ dữ liệu"
                      name="loaiKyDuLieu"
                      rules={[
                        { required: true, message: "Không được để trống!" },
                      ]}
                    >
                      <TDSelect
                        mode="multiple"
                        showSearch
                        placeholder="Chọn"
                        fetchOptions={async keyword => {
                          const res = await requestPOST<IPaginationResponse<ILoaiKyDuLieuDto[]>>(`api/v1/loaikydulieus/search`, {
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
                        style={{ width: '100%' }}
                      />
                    </FormItem>
                  </div>
                )}
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Vị trí dữ liệu bắt đầu so với chỉ tiêu"
                    name="viTriBatDau"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={VI_TRI_DU_LIEU.RIGHT}>Bên phải</Radio>
                      <Radio value={VI_TRI_DU_LIEU.DOWN}>Bên dưới</Radio>
                    </Radio.Group>
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label=" " name="suDung" valuePropName="checked">
                    <Checkbox>Sử dụng</Checkbox>
                  </FormItem>
                </div>
              </div>
            </Form>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <Button
            className="btn-sm btn-success rounded-1 py-2 px-5 ms-2"
            onClick={onFinish}
            disabled={buttonLoading}
          >
            <i className="fa fa-save me-2"></i>
            {id ? "Lưu" : "Tạo mới"}
          </Button>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Button
            className="btn-sm btn-secondary rounded-1 p-2 ms-2"
            onClick={handleCancel}
          >
            <i className="fa fa-times me-2"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export { TableDetailModal };
