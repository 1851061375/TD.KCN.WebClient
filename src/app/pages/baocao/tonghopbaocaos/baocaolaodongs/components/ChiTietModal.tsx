// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";

// import { Form, Input, Spin, Upload, DatePicker } from "antd";
// import { Modal, Button } from "react-bootstrap";
// import { toast } from "react-toastify";
// import _ from "lodash";
// import HeaderTitle from "@/app/components/HeaderTitle";
// import * as actionsModal from "@/setup/redux/modal/Actions";
// import * as authHelper from "@/app/modules/auth/core/AuthHelpers";
// import { handleImage } from "@/utils/utils";
// import {
//   requestPOST,
//   requestPOST_NEW,
//   requestPUT_NEW,
//   API_URL,
//   requestGET,
// } from "@/utils/baseAPI";
// import { downloadReport } from "@/utils/utils";
// import TDSelect from "@/app/components/TDSelect";
// import { useAuth } from "@/app/modules/auth";

// import locale from "antd/es/date-picker/locale/vi_VN";
// import dayjs from "dayjs";
// import weekday from "dayjs/plugin/weekday";
// import localeData from "dayjs/plugin/localeData";
// import "dayjs/locale/vi";

// dayjs.extend(weekday);
// dayjs.extend(localeData);
// dayjs.locale("vi");

// const FormItem = Form.Item;

// const { TextArea } = Input;
// const { Dragger } = Upload;

// const ReportModal = (props) => {
//   const dispatch = useDispatch();
//   const { currentUser } = useAuth();
//   const dataModal = useSelector((state) => state.modal.dataModal);
//   const modalVisible = useSelector((state) => state.modal.modalVisible);
//   const id = dataModal?.reportSubmittedId ?? null;
//   const [file, setFile] = useState([]);
//   const [fileScan, setFileScan] = useState([]);

//   const [form] = Form.useForm();

//   const [loadding, setLoadding] = useState(false);
//   const [btnLoading, setBtnLoading] = useState(false);
//   const [image, setImage] = useState([]);
//   const [companyId, setCompanyId] = useState(null);
//   const { token } = authHelper.getAuth();
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const res = await requestGET(`api/v1/reportsubmitteds/${id}`);
//       const _data = res.data;
//       _data.reportPeriod = _data?.reportPeriodId
//         ? {
//             value: _data?.reportPeriodId ?? null,
//             label: _data?.reportPeriodName ?? null,
//           }
//         : null;

//       _data.industrialPark = _data?.industrialParkId
//         ? {
//             value: _data?.industrialParkId ?? null,
//             label: _data?.industrialParkName ?? null,
//           }
//         : null;

//       _data.company = _data?.companyId
//         ? {
//             value: _data?.companyId ?? null,
//             label: _data?.companyName ?? null,
//           }
//         : null;

//       _data.periodNumber = _data?.periodNumberId
//         ? {
//             value: _data?.periodNumberId ?? null,
//             label: _data?.periodNumberName ?? null,
//           }
//         : null;

//       _data.reportDeadline = _data?.reportDeadlineId
//         ? {
//             value: _data?.reportDeadlineId ?? null,
//             label: _data?.reportDeadlineName ?? null,
//           }
//         : null;

//       _data.realDeadline = _data?.realDeadline
//         ? dayjs(_data.realDeadline)
//         : null;
//       if (_data?.attachmentPath) {
//         var attachmentPath = await handleImage(_data.attachmentPath);
//         setFile(attachmentPath);
//       }
//       setData(_data);
//       form.setFieldsValue(_data);
//     }
//     fetchData();
//   }, []);

//   const handleCancel = () => {
//     dispatch(actionsModal.setModalVisible(false));
//   };

//   const onFinish = async () => {
//     const values = await form.validateFields();
//     setBtnLoading(true);
//     try {
//       const formData = form.getFieldsValue(true);
//       if (id) {
//         formData.id = id;
//       }

//       formData.attachmentPath =
//         file.length > 0
//           ? file
//               .map((file) => file?.response?.data[0]?.url ?? file.path)
//               .join("##")
//           : null;
//       formData.companyId = currentUser.companyId;
//       formData.code = [
//         currentUser.companyId,
//         formData.reportYear,
//         formData.reportTemplateId,
//         formData.reportPeriodId,
//         formData.periodNumberId,
//       ].join("#");
//       formData.endDate = formData.realDeadline;
//       const res = id
//         ? await requestPUT(`api/v1/reportsubmitteds/${id}`, formData)
//         : await requestPOST(`api/v1/reportsubmitteds`, formData);
//       console.log("res", res);
//       if (res.succeeded) {
//         toast.success("Thực hiện thành công!");
//         dispatch(actionsModal.setRandom());
//         handleCancel();
//       } else {
//         toast.error("Thất bại, vui lòng thử lại!");
//       }
//     } catch (errorInfo) {
//       console.log("Failed:", errorInfo);
//     }
//     setBtnLoading(false);
//   };

//   return (
//     <Modal
//       show={modalVisible}
//       size="xl"
//       fullscreen={"lg-down"}
//       keyboard={true}
//       scrollable={true}
//       onEscapeKeyDown={handleCancel}
//     >
//       <Modal.Header className="bg-primary px-4 py-3">
//         <Modal.Title className="text-white">
//           Xem báo cáo doanh nghiệp nộp
//         </Modal.Title>
//         <button
//           type="button"
//           className="btn-close btn-close-white"
//           aria-label="Close"
//           onClick={handleCancel}
//         ></button>
//       </Modal.Header>
//       <Modal.Body>
//         <Spin spinning={loadding}>
//           {!loadding && (
//             <Form form={form} layout="vertical" autoComplete="off">
//               <div className="row">
//                 <div className="col-xl-12 col-lg-12">
//                   <HeaderTitle title={data.reportTemplateName} />
//                   <div className="row">
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Khu công nghiệp"
//                         name="industrialPark"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <TDSelect
//                           disabled
//                           placeholder=""
//                           fetchOptions={async (keyword) => {
//                             const res = await requestPOST(
//                               `api/v1/industrialparks/search`,
//                               {
//                                 pageNumber: 1,
//                                 pageSize: 1000,
//                                 advancedSearch: {
//                                   fields: ["name"],
//                                   keyword: keyword || null,
//                                 },
//                               }
//                             );
//                             return res.data.map((item) => ({
//                               ...item,
//                               label: `${item.name}`,
//                               value: item.id,
//                             }));
//                           }}
//                           style={{ width: "100%" }}
//                           onChange={(value, current) => {
//                             form.setFieldsValue({
//                               industrialParkId: value ? current?.id : null,
//                             });
//                           }}
//                         />
//                       </FormItem>
//                     </div>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Doanh nghiệp"
//                         name="company"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <TDSelect
//                           disabled
//                           showSearch
//                           placeholder="Chọn"
//                           fetchOptions={async (keyword) => {
//                             const res = await requestPOST(
//                               `api/v1/companies/search`,
//                               {
//                                 pageNumber: 1,
//                                 pageSize: 1000,
//                                 advancedSearch: {
//                                   fields: ["name"],
//                                   keyword: keyword || null,
//                                 },
//                               }
//                             );
//                             return res.data.map((item) => ({
//                               ...item,
//                               label: `${item.name}`,
//                               value: item.id,
//                             }));
//                           }}
//                           style={{ width: "100%" }}
//                           onChange={(value, current) => {
//                             if (value) {
//                               form.setFieldsValue({
//                                 companyId: value ? current?.id : null,
//                               });
//                             } else {
//                               form.setFieldsValue({
//                                 companyId: null,
//                               });
//                             }
//                           }}
//                         />
//                       </FormItem>
//                     </div>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Kỳ báo cáo"
//                         name="reportPeriod"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <TDSelect
//                           disabled
//                           showSearch
//                           placeholder="Chọn"
//                           fetchOptions={async (keyword) => {
//                             const res = await requestPOST(
//                               `api/v1/reportperiods/search`,
//                               {
//                                 pageNumber: 1,
//                                 pageSize: 1000,
//                                 advancedSearch: {
//                                   fields: ["name"],
//                                   keyword: keyword || null,
//                                 },
//                               }
//                             );
//                             return res.data.map((item) => ({
//                               ...item,
//                               label: `${item.name}`,
//                               value: item.id,
//                             }));
//                           }}
//                           onChange={(value, current) => {
//                             if (value) {
//                               form.setFieldsValue({
//                                 reportPeriodId: current.value,
//                               });
//                             } else {
//                               form.setFieldsValue({
//                                 reportPeriodId: null,
//                               });
//                             }
//                           }}
//                           style={{ width: "100%" }}
//                         />
//                       </FormItem>
//                     </div>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Số kỳ báo cáo"
//                         name="periodNumber"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <TDSelect
//                           disabled
//                           showSearch
//                           placeholder="Chọn"
//                           fetchOptions={async (keyword) => {
//                             const res = await requestPOST(
//                               `api/v1/periodnumbers/search`,
//                               {
//                                 pageNumber: 1,
//                                 pageSize: 1000,
//                                 advancedSearch: {
//                                   fields: ["name"],
//                                   keyword: keyword || null,
//                                 },
//                               }
//                             );
//                             return res.data.map((item) => ({
//                               ...item,
//                               label: `${item.name}`,
//                               value: item.id,
//                             }));
//                           }}
//                           onChange={(value, current) => {
//                             if (value) {
//                               form.setFieldsValue({
//                                 periodNumberId: current.value,
//                               });
//                             } else {
//                               form.setFieldsValue({
//                                 periodNumberId: null,
//                               });
//                             }
//                           }}
//                           style={{ width: "100%" }}
//                         />
//                       </FormItem>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Năm"
//                         name="reportYear"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <Input placeholder="" disabled />
//                       </FormItem>
//                     </div>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem label="Căn cứ pháp lý" name="decription">
//                         <Input placeholder="" disabled />
//                       </FormItem>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Đính kèm file báo cáo (chỉ đính kèm biểu đã tải về từ phần mềm)"
//                         name="attachmentPath"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <Dragger
//                           name="files"
//                           multiple={true}
//                           fileList={file}
//                           accept=".xls, .xlsx"
//                           action={`${API_URL}/api/v1/attachments/report`}
//                           headers={{
//                             Authorization: `Bearer ${token}`,
//                           }}
//                           onChange={(e) => setFile(e.fileList)}
//                         >
//                           <p className="ant-upload-text">
//                             Kéo thả tập tin hoặc nhấp chuột để tải lên
//                           </p>
//                           <p className="ant-upload-hint"></p>
//                         </Dragger>
//                       </FormItem>
//                     </div>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Đính kèm file scan"
//                         name="attachmentPath"
//                       >
//                         <Dragger
//                           name="files"
//                           multiple={true}
//                           fileList={fileScan}
//                           accept=".xls, .xlsx"
//                           action={`${API_URL}/api/v1/attachments/report`}
//                           headers={{
//                             Authorization: `Bearer ${token}`,
//                           }}
//                           onChange={(e) => setFileScan(e.fileList)}
//                         >
//                           <p className="ant-upload-text">
//                             Kéo thả tập tin hoặc nhấp chuột để tải lên
//                           </p>
//                           <p className="ant-upload-hint"></p>
//                         </Dragger>
//                       </FormItem>
//                     </div>
//                   </div>
//                   <div className="row" hidden>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Kỳ hạn nộp báo cáo"
//                         name="reportDeadline"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <TDSelect
//                           disabled
//                           showSearch
//                           placeholder="Chọn"
//                           fetchOptions={async (keyword) => {
//                             const res = await requestPOST(
//                               `api/v1/reportdeadlines/search`,
//                               {
//                                 pageNumber: 1,
//                                 pageSize: 1000,
//                                 advancedSearch: {
//                                   fields: ["name"],
//                                   keyword: keyword || null,
//                                 },
//                               }
//                             );
//                             return res.data.map((item) => ({
//                               ...item,
//                               label: `${item.name}`,
//                               value: item.id,
//                             }));
//                           }}
//                           onChange={(value, current) => {
//                             if (value) {
//                               form.setFieldsValue({
//                                 reportDeadlineId: current.value,
//                               });
//                             } else {
//                               form.setFieldsValue({
//                                 reportDeadlineId: null,
//                               });
//                             }
//                           }}
//                           style={{ width: "100%" }}
//                         />
//                       </FormItem>
//                     </div>
//                     <div className="col-xl-6 col-lg-6">
//                       <FormItem
//                         label="Ngày hết hạn"
//                         name="realDeadline"
//                         rules={[
//                           { required: true, message: "Không được để trống!" },
//                         ]}
//                       >
//                         <DatePicker
//                           locale={locale}
//                           format="DD/MM/YYYY"
//                           placeholder="DD/MM/YYYY"
//                           style={{ width: "100%" }}
//                         />
//                       </FormItem>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Spin>
//       </Modal.Body>
//       <Modal.Footer className="bg-light px-4 py-2 align-items-center">
//         <div className="d-flex justify-content-center  align-items-center">
//           <Button
//             className="btn-sm btn-secondary rounded-1 p-2  ms-2"
//             onClick={handleCancel}
//           >
//             <i className="fa fa-times"></i>Đóng
//           </Button>
//         </div>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ReportModal;
