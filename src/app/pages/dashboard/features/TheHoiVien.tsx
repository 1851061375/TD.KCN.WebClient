const TheHoiVien: React.FC = () => {
    return (
        <div className="d-flex flex-wrap justify-content-xl-between">
            <div className="d-none d-xl-flex border-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-address-card icon-lg me-3 fs-1 text-primary"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Tổng số thẻ cần cấp</small>
                    <h5 className="mr-2 mb-0">20</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-regular fa-address-card  me-3 fs-1 text-success"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thẻ cấp mới</small>
                    <h5 className="mr-2 mb-0">10</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-id-card me-3 fs-1 text-danger"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thẻ cấp lại</small>
                    <h5 className="mr-2 mb-0">5</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-id-card-clip me-3 fs-1 text-info"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thẻ đã cấp phát</small>
                    <h5 className="mr-2 mb-0">5</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-clipboard-user me-3 fs-1 text-warning"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thẻ chờ thẩm định</small>
                    <h5 className="mr-2 mb-0">5</h5>
                </div>
            </div>


        </div>
    )
}

export default TheHoiVien