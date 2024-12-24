const HoiVien: React.FC = () => {
    return (
        <div className="d-flex flex-wrap justify-content-xl-between">
            <div className="d-none d-xl-flex border-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-users icon-lg me-3 fs-1 text-primary"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Tổng số hội viên</small>
                    <h5 className="mr-2 mb-0">100</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-user-plus me-3 fs-1 text-success"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thành viên mới kết nạp</small>
                    <h5 className="mr-2 mb-0">3</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-person-circle-question me-3 fs-1 text-info"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thành viên chờ kết nạp</small>
                    <h5 className="mr-2 mb-0">5</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-user-minus me-3 fs-1 text-danger"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Số thành viên ra khỏi hội</small>
                    <h5 className="mr-2 mb-0">10</h5>
                </div>
            </div>
            <div className="d-flex border-md-right flex-grow-1 align-items-center p-3 item">
                <i className="fa-solid fa-address-card me-3 fs-1 text-warning"></i>
                <div className="d-flex flex-column justify-content-around">
                    <small className="mb-1 text-muted fs-5">Chưa có thẻ đảng viên</small>
                    <h5 className="mr-2 mb-0">10</h5>
                </div>
            </div>


        </div>
    )
}

export default HoiVien