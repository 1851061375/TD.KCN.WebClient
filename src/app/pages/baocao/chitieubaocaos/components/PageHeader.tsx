import { useDispatch } from 'react-redux';

import * as actionsModal from '@/redux/modal/Actions';
import { AppDispatch } from '@/redux/Store';

export const PageHeader = props => {
  const dispatch: AppDispatch = useDispatch();
  const { showToolbar, title } = props;

  return (
    <>
      <div
        style={{ height: '50px' }}
        className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between"
      >
        <h3 className="card-title fw-bold text-header-td fs-4 mb-0">{title ?? ''}</h3>
        {showToolbar && (
          <button
            className="btn btn-success btn-sm py-2 me-2"
            onClick={() => {
              dispatch(
                actionsModal.setModalTree({
                  visible: true,
                  type: 'add',
                })
              );
            }}
          >
            <span>
              <i className="fas fa-plus  me-2"></i>
              <span className="">Thêm mới</span>
            </span>
          </button>
        )}
      </div>
    </>
  );
};
