/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toAbsoluteUrl } from '@/_metronic/helpers';
import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AppDispatch, RootState } from '@/redux/Store';
import { IChiTieuBaoCaoDto } from '@/models';

export const ReportMtricInfo = ({dataModal}) => {
  const dispatch: AppDispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [copiedName, setCopiedName] = useState(false);
  //const dataModal = useSelector((state: RootState) => state.modal.treeData) as IChiTieuBaoCaoDto | null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopyName = () => {
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 1800);
  };
  return (
    <>
      {dataModal == null ? (
        <div className="d-flex flex-column flex-center" style={{ height: '400px' }}>
          <img src={toAbsoluteUrl('media/illustrations/sketchy-1/5.png')} className="align-self-center" alt="" style={{ height: '80%' }} />
          <div className="fs-2 fw-bolder text-dark mb-4">Chưa chọn chỉ tiêu nào.</div>
          <div className="fs-6">Chọn chỉ tiêu để hiển thị.</div>
        </div>
      ) : (
        <div className="card card-dashed m-4" style={{ height: '400px' }}>
          <div className="card-header">
            <h3 className="card-title">{dataModal.ten}</h3>
          </div>
          <div className="card-body">
            <div className="d-flex flex-column">
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Thứ tự:</span>
                <strong>{dataModal.thuTu ?? ''}</strong>
              </li>
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Mã chỉ tiêu:</span>
                <strong>{dataModal.ma ?? ''}</strong>
                {/* <CopyToClipboard text={dataModal.ma ?? ''} onCopy={handleCopy}> */}
                  <button className={`btn btn-icon btn-sm ${copied ? 'btn-light' : 'btn-light'}`}>
                    {copied ? <i className="ki-duotone ki-check fs-2 text-success"></i> : <i className="ki-duotone ki-copy fs-2 text-muted"></i>}
                  </button>
                {/* </CopyToClipboard> */}
              </li>
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Tên chỉ tiêu:</span>
                <strong>{dataModal.ten ?? ''}</strong>
                {/* <CopyToClipboard text={dataModal.ten ?? ''} onCopy={handleCopyName}> */}
                  <button className={`btn btn-icon btn-sm ${copiedName ? 'btn-light' : 'btn-light'}`}>
                    {copiedName ? <i className="ki-duotone ki-check fs-2 text-success"></i> : <i className="ki-duotone ki-copy fs-2 text-muted"></i>}
                  </button>
                {/* </CopyToClipboard> */}
              </li>
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Đơn vị tính:</span>
                <strong>{dataModal.donViTinhTen ?? ''}</strong>
              </li>
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Loại chỉ tiêu:</span>
                <strong>{dataModal.loaiChiTieu ?? ''}</strong>
              </li>
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Chỉ tiêu cha:</span>
                <strong>{dataModal.chiTieuChaTen ?? ''}</strong>
              </li>
              <li className="d-flex align-items-center py-2 fs-5">
                <span className="bullet bg-primary me-5"></span>
                <span className="me-3">Có lấy giá trị:</span>
                <label className="form-check form-check-sm form-check-custom form-check-solid me-5 me-lg-20">
                  <input
                    checked={dataModal.layDuLieu ?? false}
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    name="database_management_read"
                    disabled
                  />
                </label>
              </li>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
