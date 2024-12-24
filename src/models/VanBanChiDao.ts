export interface IVanBanChiDao {
  id: string;
  ten: string;
  soHieu: string | null;
  loaiVanBan: string | null;
  ngayBanHanh: Date | null;
  coQuanBanHanh: string | null;
  nguoiKy: string | null;
  chucVuNguoiKy: string | null;
  trichYeu: string | null;
  noiDungChiTiet: string | null;
  dinhKem: string | null;
  doiTuong: string | null;
  ghiChu: string | null;
  suDung: boolean | null;
}
