import { modalSlice, callTypes } from './Slice';
import { AppDispatch } from '../Store'; // Giả sử bạn có định nghĩa kiểu `AppDispatch` trong store

const { actions } = modalSlice;

export const setModalVisible = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisible(data));
};
export const setModalVisibleDinhKem = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleDinhKem(data));
};

export const setDataModal = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setDataModal(data));
};
export const setDataModalCongTac = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setDataModalCongTac(data));
};
export const setDataModalThanNhan = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setDataModalThanNhan(data));
};
//#region báo cáo
export const setTreeData = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setTreeData(data));
};

export const setModalTree = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalTree(data));
};
export const setDataMaHoSo = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setDataMaHoSo(data));
};
export const setModalVisibleQuanHeGiaDinh = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleQuanHeGiaDinh(data));
};
export const setModalVisibleQuaTrinhCongTac = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleQuaTrinhCongTac(data));
};
export const setModalVisibleSuaHanDinhKy = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleSuaHanDinhKy(data));
};
export const setModalVisibleDonDoc = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleDonDoc(data));
};
export const setModalVisibleBaoCaoTienDo = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleBaoCaoTienDo(data));
};
export const setModalVisibleGiaHan = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleGiaHan(data));
};
export const setModalVisibleDuyetGiaHan = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleDuyetGiaHan(data));
};
export const setModalVisibleLichSu = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleLichSu(data));
};
export const setModalVisibleNoiDungLichSu = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleNoiDungLichSu(data));
};

export const setModalVisibleHoSo = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleHoSo(data));
};
export const setCountQuaTrinhCongTac = (data: number) => (dispatch: AppDispatch) => {
  dispatch(actions.setCountQuaTrinhCongTac(data));
};
export const setCountThanNhan = (data: number) => (dispatch: AppDispatch) => {
  dispatch(actions.setCountThanNhan(data));
};

export const setModalTable = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalTable(data));
};

export const setModalTableDetail = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalTableDetail(data));
};

export const setModalMetricInTable = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalMetricInTable(data));
};

export const setModalSelectMetric = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalSelectMetric(data));
};

export const setModalBaoCaoDaNop = (data: unknown)=> (dispatch: AppDispatch) => {
  dispatch(actions.setModalBaoCaoDaNop(data));
};

export const setCountBaoCao = (data: unknown)=> (dispatch: AppDispatch) => {
  dispatch(actions.setCountBaoCao(data));
};

export const setDataThemDSCoSo = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.setDataThemDSCoSo(data));
};

export const setModalVisibleThemDSCoSo = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisibleThemDSCoSo(data));
};


export const resetData = (data: unknown) => (dispatch: AppDispatch) => {
  dispatch(actions.resetData(data));
};

export const setCurrentOrganizationUnit = (data) => (dispatch) => {
  dispatch(actions.setCurrentOrganizationUnit(data));
};

export const setModalOrganizationUnit = (data) => (dispatch) => {
  dispatch(actions.setModalOrganizationUnit(data));
};

export const setRandom = (data) => (dispatch) => {
  dispatch(actions.setRandom(data));
};
export const setRandomUsers = (data) => (dispatch) => {
  dispatch(actions.setRandomUsers(data));
};
export const setRandomPopup = () => (dispatch: AppDispatch) => {
  dispatch(actions.setRandomPopup());
};
//#endregion
