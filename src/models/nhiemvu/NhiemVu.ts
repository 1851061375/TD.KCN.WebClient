export interface INhiemVu {
    id: string; // ID của nhiệm vụ
    ma: string | null; // Mã nhiệm vụ
    ten: string; // Tên nhiệm vụ
    moTa: string | null; // Mô tả nhiệm vụ
    thuTu: number | null; // Thứ tự nhiệm vụ
    suDung: boolean | null; // Trạng thái sử dụng (true/false)
    donViGiaoId: string | null; // ID đơn vị giao
    donViXuLyId: string | null; // ID đơn vị xử lý
    maTrangThai: string | null; // ID trạng thái
    trangThaiId: string | null; // ID trạng thái
    tenTrangThai: string | null; // tên trạng thái
   // trangThai: { value: string | null; label: string | null; } | null; // Trạng thái (nếu cần lưu thêm thông tin)
    theoDinhKy: boolean | null; // Nhiệm vụ có thực hiện định kỳ hay không
    kyHan: string | null; // Kỳ hạn (tháng, quý, năm)
    thoiHanKetThucDinhKy: Date | null; // Thời hạn kết thúc định kỳ
    thoiHanHoanThanh: Date | null; // Thời hạn hoàn thành
    dinhKem: string | null; // Tệp đính kèm
    trangThai:any|null;
  }