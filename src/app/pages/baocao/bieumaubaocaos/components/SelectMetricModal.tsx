import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import _ from "lodash";
import * as actionsModal from '@/redux/modal/Actions';
import * as actionsGlobal from '@/redux/global/Actions';
import { AppDispatch, RootState } from "@/redux/Store";
import { requestPOST } from "@/utils/baseAPI";
import { IChiTieuBaoCaoDto, IPaginationResponse, IResult } from "@/models";
import { toast } from "react-toastify";
import "./TreeComponent.css";
import "./jstree.min.css";

const SelectMetricModal = (props) => {
  const dispatch: AppDispatch = useDispatch();

  const modalSelectMetric = useSelector((state: RootState) => state.modal.modalSelectMetric);
  var bangTrongMauBaoCao = modalSelectMetric?.bangTrongMauBaoCao ?? null;
  var bangTrongMauBaoCaoId = bangTrongMauBaoCao?.id ?? null;
  var bieuMauBaoCaoId = bangTrongMauBaoCao?.bieuMauBaoCaoId ?? null;
  var selectedNodeIds = modalSelectMetric?.selectedNodeIds ?? [];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const [treeData, setTreeData] = useState([]);

  const treeRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);


  const fetchMetricData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await requestPOST<IPaginationResponse<IChiTieuBaoCaoDto[]>>
        ('api/v1/chitieubaocaos/search', {
          pageNumber: 1,
          pageSize: 10000,
          bangTrongMauBaoCaoId,
          bieuMauBaoCaoId,
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
      setIsLoading(false);
    }
  };

  const nest = (items) =>
    items.map((item) => ({
      id: item.id,
      parent: item.chiTieuChaId ? item.chiTieuChaId : "#",
      text: `<b>${item.ma}</b> ${item.ten}`,
      data: item,
    }));

  useEffect(() => {
    fetchMetricData();
    return () => { };
  }, []);

  useEffect(() => {
    const loadJsTree = async () => {
      try {
        $(treeRef.current!)
          .jstree({
            core: {
              data: treeData,
              check_callback: true,
            },
            checkbox: {
              visible: true,
              three_state: false,
              tie_selection: false,
            },
            types: {
              default: {
                icon: "ki-outline ki-folder",
              },
              file: {
                icon: "ki-outline ki-file",
              },
            },
            plugins: ["contextmenu", "types", "search", "checkbox"],
            // contextmenu: {
            //   items: {
            //     RmChild: {
            //       label: "Loại bỏ",
            //       action: function (data) {
            //         const instance = $.jstree.reference(data.reference);
            //         const node = instance.get_node(data.reference);
            //         instance.delete_node(node);
            //       },
            //     },
            //   },
            // },
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
            $(treeRef.current!).jstree(true).check_node(selectedNodeIds);

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

  const onFinish = async () => {
    setButtonLoading(true);
    try {
      const checkedNodes = $(treeRef.current!).jstree("get_checked", true);
      const selectedItems = checkedNodes.map((node) => ({
        chiTieuBaoCaoId: node.id,
        coLayGiaTri: node.data.coLayGiaTri,
        laTruongBatBuoc: false,
        bieuMauBaoCaoId: bieuMauBaoCaoId,
        bangTrongMauBaoCaoId: bangTrongMauBaoCaoId,
      }));

      var formData = {
        bieuMauBaoCaoId: bieuMauBaoCaoId,
        bangTrongMauBaoCaoId: bangTrongMauBaoCaoId,
        chiTieuTrongBangBaoCaos: selectedItems,
      };

      const response = await requestPOST<IResult<string>>(`api/v1/chitieutrongbangbaocaos`, formData);

      if (response?.status == 200) {
        toast.success("Thực hiện thành công!");
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

  const handleCancel = () => {
    dispatch(actionsModal.setModalSelectMetric({ visible: false }));
  };

  return (
    <Modal
      show={modalSelectMetric.visible || false}
      fullscreen={true}
      size="xl"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Chọn chỉ tiêu</Modal.Title>
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
                <i>{bangTrongMauBaoCao?.ten}</i>
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
            </div>
          </div>
          <div className="card-body card-dashboard px-3 py-3">
            <div className="tree-demo" ref={treeRef}></div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center align-items-center">
          <Button
            className="btn-sm btn-success rounded-1 py-2 px-5 ms-2"
            onClick={onFinish}
            disabled={buttonLoading}
          >
            <i className="fa fa-save me-2"></i>
            {"Lưu"}
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

export { SelectMetricModal };

