import { HanhDongNhacViecBaoCaoEnum, INhacViecBaoCaoDto, IPaginationResponse } from "@/models";
import { requestPOST } from "@/utils/baseAPI";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const ToDoCard = ({ className, setReportFilter, form }) => {
  const navigate = useNavigate();
  // Dữ liệu danh sách nhắc việc
  const [dataTable, setDataTable] = useState<INhacViecBaoCaoDto[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  // Phân trang
  const [pageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<INhacViecBaoCaoDto[]>>('api/v1/dashboardbaocao/getnhacviecs', {
        pageNumber: 1,
        pageSize: 1000,
      });

      if (response.data) {
        const { data, totalCount } = response.data;
        setDataTable(data ?? []);
        setTotalPages(Math.ceil(totalCount / pageSize));
      } else {
        setDataTable([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      setDataTable([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);




  return (
    !loading && (
      <div className={`card ${className} carousel  slide`}
        id="kt_carousel_todo"
        data-bs-ride="carousel"
        data-bs-interval="8000">
        {/* begin::Header */}
        <div className="card-header border-1 card-custom-padding"
          style={{
            minHeight: "60px"
          }}>
          <h3 className="card-title fw-bold">Nhắc việc</h3>
          {/* Indicators */}
          <div className="card-toolbar">
            <ol className="p-0 m-0 carousel-indicators"
              style={{
                top: 0,
                left: "unset",
              }}>
              {totalPages > 1 && Array.from({ length: totalPages }).map((_, index) => (
                <li style={{ width: "20px" }} data-bs-target="#kt_carousel_todo" data-bs-slide-to={index} className={`ms-1 ${index === 0 ? "active" : ""}`}></li>
              ))}
            </ol>
          </div>
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className="card-body card-custom-padding">
          <div className="carousel-inner">
            {Array.from({ length: totalPages }).map((_, index) => {
              // Chia dữ liệu theo trang
              const start = index * pageSize;
              const end = start + pageSize;
              const pageData = dataTable.slice(start, end);

              return (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  {pageData.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex align-items-center mb-3"
                    >
                      {/* Bullet Icon */}
                      <div className="flex-grow-1">
                        <span className="bullet bullet-dot bg-primary me-2 h-10px w-10px"></span>
                        {item.hanhDong == HanhDongNhacViecBaoCaoEnum.ChuyenHuong ? (
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(item.dich!)
                            }}
                            className="text-gray-800 text-hover-primary fw-bold fs-6"
                          >
                            {item.moTa}
                          </a>
                        ) : (
                          <a
                            data-kt-scroll-toggle
                            href={`#${item.dich}`}
                            onClick={() => {
                              form.setFieldsValue({ loaiBaoCaoId: item.dich });
                              setReportFilter(prev => ({ ...prev, loaiBaoCaoId: item.dich }))
                            }}
                            className="text-gray-800 text-hover-primary fw-bold fs-6"
                          >
                            {item.moTa}
                          </a>
                        )}

                        <div className="separator separator-dashed my-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        {/* end::Body */}
      </div >
    )

  );
};

export { ToDoCard };
