/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Tree, Dropdown, Spin } from "antd";
import { toast } from "react-toastify";
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { requestGET, requestDELETE, requestPOST } from "@/utils/baseAPI";
import { ReportMetricDetailModal } from "./index";
import { AppDispatch, RootState } from "@/redux/Store";
import { IChiTieuBaoCaoDto, IPaginationResponse } from "@/models";

export const ReportMetricTree = ({onDataFromTree}) => {
  const dispatch: AppDispatch = useDispatch();
  const modalTree = useSelector((state: RootState) => state.modal.modalTree) as unknown as { visible: boolean, type: string };
  const random = useSelector((state: RootState) => state.global.random);

  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState([]);

  const nest = (items, chiTieuChaId = null) =>
    items
      .filter((item) => item.chiTieuChaId === chiTieuChaId)
      .map((item) => ({
        ...item,
        title: renderDropdownMenu(item),
        key: item.id,
        children: nest(items, item.id),
      }));

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await requestPOST<IPaginationResponse<IChiTieuBaoCaoDto[]>>('api/v1/chitieubaocaos/search', {
        pageNumber: 1,
        pageSize: 100000,
        orderBy: ["thuTu"],
      });

      if (response.data) {
        const { data } = response.data;
        const nestedData = nest(data ?? []);
        setTreeData(nestedData);
      } else {
        setTreeData([]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (id) => {
    Modal.confirm({
      title: "Xoá chỉ tiêu",
      content: "Bạn có chắc chắn muốn xoá chỉ tiêu này?",
      okText: "Đồng ý",
      cancelText: "Huỷ",
      onOk: async () => {
        const res = await requestDELETE(`api/v1/chitieubaocaos/${id}`);
        if (res) {
          toast.success("Thao tác thành công!");
          dispatch(actionsGlobal.setRandom());
          dispatch(actionsModal.setTreeData(null));
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
      },
    });
  };

  // const fetchTreeData = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await requestPOST(`api/v1/chitieubaocaos/search`, {
  //       advancedSearch: {
  //         fields: ["ten", "ma"],
  //         keyword: null,
  //       },
  //       pageNumber: 1,
  //       pageSize: 100000,
  //       orderBy: ["thuTu"],
  //     });

  //     const nest = (items, chiTieuChaId = null) =>
  //       items
  //         .filter((item) => item.chiTieuChaId === chiTieuChaId)
  //         .map((item) => ({
  //           ...item,
  //           title: renderDropdownMenu(item),
  //           key: item.id,
  //           children: nest(items, item.id),
  //         }));

  //     const nestedData = nest(res?.data ?? []);
  //     console.log(nestedData);
  //     setTreeData(nestedData);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  const renderDropdownMenu = (item) => (
    <Dropdown
      menu={{
        items: [
          {
            key: "edit-group",
            label: (
              <span
                className="e-1 p-2 text-dark"
                onClick={() => {
                  dispatch(
                    actionsModal.setModalTree({
                      visible: true,
                      type: 'edit-group',
                    })
                  );
                }}
              >
                <i className={`fa fa-edit me-2`}></i>Sửa chỉ tiêu
              </span>
            ),
          },
          {
            key: "add",
            label: (
              <span
                className="e-1 p-2 text-dark"
                onClick={() =>
                  dispatch(
                    actionsModal.setModalTree({
                      visible: true,
                      type: "add-subgroup",
                    })
                  )
                }
              >
                <i className={`fa fa-plus me-2`}></i>Thêm chỉ tiêu con
              </span>
            ),
          },
          {
            key: "delete-unit",
            label: (
              <span
                className="e-1 p-2 text-dark"
                onClick={() => confirmDelete(item.id)}
              >
                <i className={`fa fa-trash me-2`}></i>Xoá chỉ tiêu
              </span>
            ),
          },
        ],
      }}
      trigger={["contextMenu"]}
    >
      <div className="site-dropdown-context-menu">
        <span className="badge badge-circle badge-outline badge-dark me-2">
          {item.thuTu ?? ""}
        </span>
        <strong>{item.ma}</strong>&nbsp;
        {item.ten}
      </div>
    </Dropdown>
  );

  useEffect(() => {
    dispatch(
      actionsModal.setTreeData(null)
    );
    fetchData();
  }, [random]);

  const onSelect = (keys, info) => {
    // dispatch(
    //   actionsModal.setTreeData(info?.node)
    // );
    onDataFromTree(info?.node)
  };

  return (
    <>
      <div className="card-body card-dashboard px-3 py-3">
        <div className="card-dashboard-body">
          <Spin spinning={loading}>
            {!loading && (
              <Tree
                blockNode
                onSelect={onSelect}
                treeData={treeData}
                showLine={{ showLeafIcon: false }}
              />
            )}
          </Spin>
        </div>
      </div>
      {modalTree?.visible && <ReportMetricDetailModal />}
    </>
  );
};

