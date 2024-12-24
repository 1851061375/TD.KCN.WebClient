import { organizationUnitSlice, callTypes, ModalState } from './Slice';
import { AppDispatch } from '../Store'; // Giả sử bạn có định nghĩa kiểu `AppDispatch` trong store
import { IOrganizationUnitDetails } from '@/models/OrganizationUnit';

const { actions } = organizationUnitSlice;

export const setModalVisible = (data: ModalState) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalVisible(data));
};

export const setSelectedOrganizationUnit = (data: IOrganizationUnitDetails | null) => (dispatch: AppDispatch) => {
  dispatch(actions.setSelectedOrganizationUnit(data));
};

export const setModalAddUsersVisible = (data: boolean) => (dispatch: AppDispatch) => {
  dispatch(actions.setModalAddUsersVisible(data));
};

export const resetData = () => (dispatch: AppDispatch) => {
  dispatch(actions.resetData());
};
