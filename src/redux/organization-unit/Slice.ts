import { IOrganizationUnitDetails } from '@/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  modalVisible: boolean;
  type: 'edit' | 'createChild' | null;
  modalData: IOrganizationUnitDetails | null;
}

interface OrganizationUnitState {
  selectedOrganizationUnit: IOrganizationUnitDetails | null;
  modalAddUsersVisible: boolean;
  modalState: ModalState;

  listLoading: boolean;
  actionsLoading: boolean;
  error: string | null;
}

// Kiểu cho action payload
interface StartCallPayload {
  callType: keyof typeof callTypes;
}

interface CatchErrorPayload extends StartCallPayload {
  error: string;
}

const initialState: OrganizationUnitState = {
  selectedOrganizationUnit: null,
  modalAddUsersVisible: false,
  modalState: {
    modalVisible: false,
    type: null,
    modalData: null,
  },
  listLoading: false,
  actionsLoading: false,
  error: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const organizationUnitSlice = createSlice({
  name: 'organizationUnit',
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

    setModalVisible: (state, action: PayloadAction<ModalState>) => {
      const payload = action.payload;
      state.modalState.modalVisible = payload.modalVisible;
      state.modalState.type = payload.type;
      state.modalState.modalData = payload.modalData;
      if (!state.modalState.modalVisible) {
        state.modalState.modalData = null;
      }
    },
    setModalAddUsersVisible: (state, action: PayloadAction<boolean>) => {
      state.modalAddUsersVisible = action.payload;
    },
    setSelectedOrganizationUnit: (state, action: PayloadAction<IOrganizationUnitDetails | null>) => {
      const payload = action.payload;
      state.selectedOrganizationUnit = payload;
      if (!payload?.id) {
        state.modalAddUsersVisible = false;
      }
    },
    resetData: state => {
      state.selectedOrganizationUnit = null;
      state.modalState = {
        modalVisible: false,
        type: null,
        modalData: null,
      };
      state.modalAddUsersVisible = false;
    },
  },
});

export const { catchError, startCall, setModalVisible, setSelectedOrganizationUnit, resetData } = organizationUnitSlice.actions;
export default organizationUnitSlice.reducer;
