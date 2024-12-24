import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';

import { globalSlice } from './global/Slice';
import { modalSlice } from './modal/Slice';
import { organizationUnitSlice } from './organization-unit/Slice';

export const rootReducer = combineReducers({
  global: globalSlice.reducer,
  modal: modalSlice.reducer,
  organizationUnit: organizationUnitSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([]);
}
