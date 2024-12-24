import { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Spin, Checkbox, Empty } from "antd";
import { Modal, Button } from "react-bootstrap";
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { requestPOST, requestPUT } from "@/utils/baseAPI";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/Store";
import { IBangTrongMauBaoCaoDto, IChiTieuTrongBangBaoCaoDto, IPaginationResponse, IResult } from "@/models";

const MetricInTableModal = () => {
  const dispatch: AppDispatch = useDispatch();
  const modalMetricInTable = useSelector((state: RootState) => state.modal.modalMetricInTable);
  const bangTrongMauBaoCao = modalMetricInTable.bangTrongMauBaoCao as IBangTrongMauBaoCaoDto | null;
  const bangTrongMauBaoCaoId = bangTrongMauBaoCao?.id ?? null;
  const bieuMauBaoCaoId = bangTrongMauBaoCao?.bieuMauBaoCaoId ?? null;
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<
    {
      id: string;
      parent: string;
      text: string;
      data:
      {
        coLayGiaTri: {
          coLayGiaTri: boolean | null;
          id: string;
          chiTieuBaoCaoId: string;
        };
        laTruongBatBuoc: {
          laTruongBatBuoc: boolean | null;
          id: string;
          chiTieuBaoCaoId: string;
        };
      };
    }[]>([]);
  const [data, setData] = useState<IChiTieuTrongBangBaoCaoDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isGetValueChecked, setIsGetValueChecked] = useState<Record<string, { coLayGiaTri: boolean; laTruongBatBuoc: boolean }>>({});

  const treeRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const nest = (items: IChiTieuTrongBangBaoCaoDto[]) =>
    items
      .map((item) => ({
        id: item.chiTieuBaoCaoId,
        parent: item.chiTieuChaId ? item.chiTieuChaId : "#",
        text: `<b>${item.chiTieuBaoCaoMa}</b> ${item.chiTieuBaoCaoTen}`,
        data: {
          coLayGiaTri: {
            coLayGiaTri: item.coLayGiaTri,
            id: item.id,
            chiTieuBaoCaoId: item.chiTieuBaoCaoId,
          },
          laTruongBatBuoc: {
            laTruongBatBuoc: item.laTruongBatBuoc,
            id: item.id,
            chiTieuBaoCaoId: item.chiTieuBaoCaoId,
          },
        },
      }));

  const fetchMetricInTableData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await requestPOST<IPaginationResponse<IChiTieuTrongBangBaoCaoDto[]>>
        ('api/v1/chitieutrongbangbaocaos/search', {
          pageNumber: 1,
          pageSize: 10000,
          bangTrongMauBaoCaoId,
          bieuMauBaoCaoId,
          // orderBy: ["thuTu"],
        });

      if (response.data) {
        const { data } = response.data;
        setData(data);
        const nestedData = nest(data ?? []);
        setTreeData(nestedData);
      } else {
        setTreeData([]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error)
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      setTreeData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllCurrentNodeId = () => {
    if (treeData.length === 0) return [];
    const allNodes = $(treeRef.current!)
      .jstree(true)
      .get_json("#", { flat: true });
    const nodeIds = allNodes.map((node) => node.id);
    return nodeIds;
  };


  useEffect(() => {
    fetchMetricInTableData();
    return () => { };
  }, []);

  useEffect(() => {
    const loadJsTree = async () => {
      try {
        // Khởi tạo jstree sau khi tất cả các thư viện đã được load
        $(treeRef.current!)
          .jstree({
            core: {
              data: treeData,
            },
            types: {
              default: {
                icon: "ki-outline ki-folder",
              },
              file: {
                icon: "ki-outline ki-file",
              },
            },
            state: { key: "demo2" },
            plugins: [
              "table",
              "contextmenu",
              "types",
              "dnd",
              "search",
              "state",
            ],
            contextmenu: {
              items: function ($node) {
                return {
                  RmChild: {
                    label: "Loại bỏ",
                    action: function () {
                      // Thực hiện hành động loại bỏ node
                    },
                  },
                };
              },
            },
            dnd: { drag_selection: false },
            table: {
              columns: [
                {
                  header: "Chỉ tiêu",
                  headerClass: "fw-bold fs-6",
                },
                {
                  header: "Bắt buộc có giá trị",
                  value: "laTruongBatBuoc",
                  headerClass: "fw-bold fs-6",
                  format: function (v) {
                    return `<div style="width:100px;text-align:center;">
                      <input type="checkbox" name="laTruongBatBuoc" ${v.laTruongBatBuoc ? "checked" : ""
                      } value="true" data-id=${v.id} data-chitieubaocaoid=${v.chiTieuBaoCaoId
                      } />
                    </div>`;
                  },
                },
                {
                  header: "Có lấy giá trị",
                  value: "coLayGiaTri",
                  headerClass: "fw-bold fs-6",
                  format: function (v) {
                    return `<div style="width:100px;text-align:center;">
                      <input type="checkbox" name="coLayGiaTri" ${v.coLayGiaTri ? "checked" : ""
                      } value="true" data-id=${v.id} data-chitieubaocaoid=${v.chiTieuBaoCaoId
                      } />
                    </div>`;
                  },
                },
              ],
            },
          })
          .on("ready.jstree", function (e, data) {
            let timeoutId: NodeJS.Timeout | null = null;

            $(searchRef.current!).on("keyup", function () {
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              timeoutId = setTimeout(() => {
                const searchText = $(searchRef.current!).val();
                data.instance.search(searchText);
              }, 250);
            });
            const instance = $(treeRef.current!).jstree(true);

            instance.get_json("#", { flat: true }).forEach((node) => {
              if (node.children && node.children.length > 0) {
                // Kiểm tra xem node có phải là node cha không
                instance.open_node(node.id); // Chỉ mở node cha
              }
            });
            $(treeRef.current!).jstree("open_all");

          });

        setIsLoading(false);

      } catch (error) {
        console.error("Error loading jstree:", error);
        setIsLoading(false);
      }
    };

    if (treeData.length > 0) {
      loadJsTree();
    }

    return () => {
      if (treeRef.current) {
        $(treeRef.current).jstree("destroy").empty();
      }
    };
  }, [treeData]);

  const handleCancel = () => {
    form.resetFields();
    dispatch(actionsModal.setModalMetricInTable({ visible: false }));
  };


  const onFinish = async () => {
    setButtonLoading(true);
    try {
      const checkboxes = $(
        "input[type=checkbox][name=coLayGiaTri], input[type=checkbox][name=laTruongBatBuoc]"
      );
      const checkboxData = Array.from(checkboxes).reduce((acc, checkbox) => {
        const id = $(checkbox).data("id");
        const reportMetricId = $(checkbox).data("chitieubaocaoid");
        const name = $(checkbox).attr("name");
        const isChecked = $(checkbox).is(":checked");

        if (!acc[id]) {
          acc[id] = { id };
        }
        acc[id].chiTieuBaoCaoId = reportMetricId;
        acc[id].bieuMauBaoCaoId = bieuMauBaoCaoId;
        acc[id].bangTrongMauBaoCaoId = bangTrongMauBaoCaoId;
        acc[id][name] = isChecked;

        return acc;
      }, {});

      const groupedData = Object.values(checkboxData);

      const response = await requestPUT<IResult<string>>(`api/v1/chitieutrongbangbaocaos/update-range`, {
        chiTieuTrongBangBaoCaos: groupedData,
      });

      if (response?.status == 200) {
        toast.success('Thực hiện thành công!');
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
      show={modalMetricInTable.visible || false}
      fullscreen={true}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Chỉ tiêu trong bảng báo cáo</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="card card-xl-stretch mb-xl-9">
          <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
            <div className="d-flex flex-column">
              <span className="fs-6">
                <i className="text-decoration-underline me-3">Biểu mẫu:</i>
                <i>{bangTrongMauBaoCao?.bieuMauBaoCaoTen}</i>
              </span>
              <span className="fs-6">
                <i className="text-decoration-underline me-3">Bảng:</i>
                <i>{bangTrongMauBaoCao?.ten}</i>
              </span>
            </div>

            <div className="card-toolbar">

              <div className="btn-group me-2 w-400px">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nhập từ khoá tìm kiếm"
                  ref={searchRef}
                />
              </div>
              <button
                className="btn btn-primary btn-sm py-2 me-2"
                onClick={() => {
                  dispatch(actionsModal.setModalSelectMetric(
                    {
                      visible: true,
                      bangTrongMauBaoCao: bangTrongMauBaoCao,
                      selectedNodeIds: getAllCurrentNodeId()
                    }));
                }}
              >
                <span>
                  <i className="fas fa-up-right-from-square me-2"></i>
                  <span className="">Chọn chỉ tiêu</span>
                </span>
              </button>
            </div>
          </div>
          <div className="card-body card-dashboard px-3 py-3">
            {treeData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className="tree-demo" ref={treeRef}></div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <Button
          className="btn-sm btn-success rounded-1 py-2 px-5 ms-2"
          onClick={onFinish}
          disabled={buttonLoading}
        >
          <i className="fa fa-save me-2"></i>
          {"Lưu"}
        </Button>
        <Button
          className="btn-sm btn-secondary rounded-1 p-2 ms-2"
          onClick={handleCancel}
        >
          <i className="fa fa-times me-2"></i>Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { MetricInTableModal };
