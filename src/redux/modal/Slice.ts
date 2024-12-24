import { IBangTrongMauBaoCaoDto, IBaoCaoDaNopDto, IBieuMauBaoCaoDto } from '@/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setModalVisibleSuaHanDinhKy } from './Actions';
import { setModalVisibleDinhKem } from './Actions';

interface ModalState {
  randomPopUp: string | null;
  dataModal: null;
  dataModalCongTac: null;
  dataModalThanNhan: null;
  dataMaHoSo: null;
  modalVisible: boolean;
  modalVisibleHoSo: boolean;
  modalVisibleDinhKem: boolean;
  modalTable: {
    visible: boolean | null;
    bieuMauBaoCao: IBieuMauBaoCaoDto | null;
  };

  modalTableDetail: {
    visible: boolean | null;
    bangTrongMauBaoCao: IBangTrongMauBaoCaoDto | null;
  };

  modalMetricInTable: {
    visible: boolean | null;
    bangTrongMauBaoCao: IBangTrongMauBaoCaoDto | null;
  };

  modalSelectMetric: {
    visible: boolean | null;
    bangTrongMauBaoCao: IBangTrongMauBaoCaoDto | null;
    selectedNodeIds: string[];
  };

  modalBaoCaoDaNop: {
    visible: boolean | null;
    data: IBaoCaoDaNopDto|null;
  };

  countBaoCao: {
    tatCa: number | null;
    denHan: number | null;
    chuaDenHan: number | null;
    quaHan: number | null;
  };

  modalVisibleQuaTrinhCongTac: boolean;
  modalVisibleQuanHeGiaDinh: boolean;
  modalVisibleSuaHanDinhKy: boolean;
  modalVisibleDonDoc: boolean;
  modalVisibleBaoCaoTienDo: boolean;
  modalVisibleGiaHan: boolean;
  modalVisibleDuyetGiaHan: boolean;
  modalVisibleLichSu: boolean;
  modalVisibleNoiDungLichSu: boolean;
  //modalVisibleNopBaoCao: boolean;

  treeData: null;
  modalTree: null;
  listLoading: boolean;
  actionsLoading: boolean;
  error: string | null;
  coutQuaTrinhCongTac: number;
  countThanNhan: number;
  dataThemDSCoSo: null;
  modalVisibleThemDSCoSo: boolean;
  currentOrganizationUnit: null,
  modalOrganizationUnit: null,
  random: string | null,
  randomUsers: string | null,
}

// Kiểu cho action payload
interface StartCallPayload {
  callType: keyof typeof callTypes;
}

interface CatchErrorPayload extends StartCallPayload {
  error: string;
}

const initialState: ModalState = {
  randomPopUp: null,
  dataModal: null,
  dataModalCongTac: null,
  dataModalThanNhan: null,
  dataMaHoSo: null,
  modalVisible: false,
  modalVisibleHoSo: false,
  modalVisibleDinhKem: false,
  treeData: null,
  modalTree: null,
  modalTable: {
    visible: false,
    bieuMauBaoCao: null,
  },
  modalTableDetail: {
    visible: false,
    bangTrongMauBaoCao: null,
  },
  modalMetricInTable: {
    visible: false,
    bangTrongMauBaoCao: null,
  },
  modalSelectMetric: {
    visible: false,
    bangTrongMauBaoCao: null,
    selectedNodeIds: [],
  },
  modalBaoCaoDaNop: {
    visible: false,
    data: null
  },
  countBaoCao: {
    tatCa: null,
    denHan: null,
    chuaDenHan: null,
    quaHan: null
  },
  listLoading: false,
  actionsLoading: false,
  modalVisibleQuaTrinhCongTac: false,
  modalVisibleQuanHeGiaDinh: false,
  modalVisibleSuaHanDinhKy: false,
  modalVisibleDonDoc: false,
  modalVisibleBaoCaoTienDo: false,
  modalVisibleGiaHan: false,
  modalVisibleDuyetGiaHan: false,
  modalVisibleLichSu: false,
  modalVisibleNoiDungLichSu: false,
  error: null,
  coutQuaTrinhCongTac: 0,
  countThanNhan: 0,
  dataThemDSCoSo: null,
  modalVisibleThemDSCoSo: false,
  currentOrganizationUnit: null,
  modalOrganizationUnit: null,
  random: null,
  randomUsers: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    catchError: (state, action: PayloadAction<CatchErrorPayload>) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action: PayloadAction<StartCallPayload>) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    setModalVisible: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisible = payload;
      if (!state.modalVisible) {
        state.dataModal = null;
      }
    },
    setModalVisibleDinhKem: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleDinhKem = payload;
      if (!state.modalVisibleDinhKem) {
        state.dataModal = null;
      }
    },
    setDataModal: (state, action) => {
      const payload = action.payload;
      state.dataModal = payload;
    },

    //#region báo cáo

    setDataModalThanNhan: (state, action) => {
      const payload = action.payload;
      state.dataModalThanNhan = payload;
    },
    setDataModalCongTac: (state, action) => {
      const payload = action.payload;
      state.dataModalCongTac = payload;
    },
    setDataMaHoSo: (state, action) => {
      const payload = action.payload;
      state.dataMaHoSo = payload;
    },
    setModalVisibleQuaTrinhCongTac: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleQuaTrinhCongTac = payload;
      if (!state.modalVisibleQuaTrinhCongTac) {
        state.dataModalCongTac = null;
      }
    },
    setModalVisibleQuanHeGiaDinh: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleQuanHeGiaDinh = payload;
      if (!state.modalVisibleQuanHeGiaDinh) {
        state.dataModalThanNhan = null;
      }
    },

    setTreeData: (state, action) => {
      const payload = action.payload;
      state.treeData = payload;
    },

    setModalTree: (state, action) => {
      const payload = action.payload;
      state.modalTree = payload;
      if (!state.modalTree) {
        state.treeData = null;
      }
    },

    setModalTable: (state, action) => {
      const payload = action.payload;
      state.modalTable = payload;
      if (!state.modalTable.visible) {
        state.modalTable.bieuMauBaoCao = null;
      }
    },

    setModalTableDetail: (state, action) => {
      const payload = action.payload;
      state.modalTableDetail = payload;
      if (!state.modalTableDetail.visible) {
        state.modalTableDetail.bangTrongMauBaoCao = null;
      }
    },

    setModalMetricInTable: (state, action) => {
      const payload = action.payload;
      state.modalMetricInTable = payload;
      if (!state.modalMetricInTable.visible) {
        state.modalMetricInTable.bangTrongMauBaoCao = null;
      }
    },

    setModalSelectMetric: (state, action) => {
      const payload = action.payload;
      state.modalSelectMetric = payload;
      if (!state.modalSelectMetric.visible) {
        state.modalSelectMetric.bangTrongMauBaoCao = null;
        state.modalSelectMetric.selectedNodeIds = [];
      }
    },

    setModalVisibleHoSo: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleHoSo = payload;
      if (!state.modalVisibleHoSo) {
        state.dataModal = null;
      }
    },
    setModalVisibleSuaHanDinhKy: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleSuaHanDinhKy = payload;
      if (!state.modalVisibleSuaHanDinhKy) {
        state.dataModal = null;
      }
    },
    setModalVisibleDonDoc: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleDonDoc = payload;
      if (!state.modalVisibleDonDoc) {
        state.dataModal = null;
      }
    },
    setModalVisibleBaoCaoTienDo: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleBaoCaoTienDo = payload;
      if (!state.modalVisibleBaoCaoTienDo) {
        state.dataModal = null;
      }
    },
    setModalVisibleGiaHan: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleGiaHan = payload;
      if (!state.modalVisibleGiaHan) {
        state.dataModal = null;
      }
    },
    setModalVisibleDuyetGiaHan: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleDuyetGiaHan = payload;
      if (!state.modalVisibleDuyetGiaHan) {
        state.dataModal = null;
      }
    },
    setModalVisibleLichSu: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleLichSu = payload;
      if (!state.modalVisibleLichSu) {
        state.dataModal = null;
      }
    },
    setModalVisibleNoiDungLichSu: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleNoiDungLichSu = payload;
      if (!state.modalVisibleNoiDungLichSu) {
        state.dataModal = null;
      }
    },

    setModalBaoCaoDaNop: (state, action: PayloadAction<any>) => {
      const payload = action.payload;
      state.modalBaoCaoDaNop = payload;
      if (!state.modalBaoCaoDaNop.visible) {
        state.modalBaoCaoDaNop.data = null;
      }
    },

    setCountBaoCao: (state, action: PayloadAction<any>) => {
      const payload = action.payload;
      state.countBaoCao = payload;
    },

    setCountQuaTrinhCongTac: (state, action) => {
      const payload = action.payload;
      state.coutQuaTrinhCongTac = payload;
    },
    setCountThanNhan: (state, action) => {
      const payload = action.payload;
      state.countThanNhan = payload;
    },

    setDataThemDSCoSo: (state, action) => {
      const payload = action.payload;
      state.dataThemDSCoSo = payload;
    },
    
    setModalVisibleThemDSCoSo: (state, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.modalVisibleThemDSCoSo = payload;
      if (!state.modalVisibleThemDSCoSo) {
        state.dataThemDSCoSo = null;
      }
    },

    resetData: (state, action) => {
      state = initialState;
    },

    setCurrentOrganizationUnit: (state, action) => {
      const payload = action.payload;
      state.currentOrganizationUnit = payload;
    },

    setModalOrganizationUnit: (state, action) => {
      const payload = action.payload;
      state.modalOrganizationUnit = payload;
      if (!state.modalOrganizationUnit) {
        state.currentOrganizationUnit = null;
      }
    },

    setRandom: (state, action) => {
      state.random = Math.random().toString(32);
    },

    setRandomUsers: (state, action) => {
      state.randomUsers = Math.random().toString(32);
    },
    setRandomPopup: state => {
      state.randomPopUp = Math.random().toString(32);
    },
  },});

export const { catchError, startCall, setModalVisible } = modalSlice.actions;
export default modalSlice.reducer;
