import moment, { Moment } from 'moment';
export interface IHoSoKetNap {
  id: string;
  tenDanhSach: string | null;
  maDanhSach: string | null;
  soNguoi: number | null;
  ngayGui: Date | null;
  ngayDuyet: Date | null;
  trangThai: string | null;
  ghiChu: string | null;
  dinhKem: string | null;
  keHoachId: any | null;
  tenKeHoach: string | null;
  donViId: string | null;
  maDonVi: string | null;
  tenDonVi: string | null;
  lyDoTraVe: string | null;
  dinhKemLyDoTraVe: string | null;
  viTri: string | null;
  listLyLichKetNapId: string | null;
  dinhKemXaPhuongXetDuyet: string | null;
  dinhKemQuanHuyenXetDuyet: string | null;
}

export interface IXetDuyetLyLich {
  listLyLichKetNapId: string | null;
  trangThai: string | null;
  isKetNap: boolean | null;
}

export interface ILyLichKetNap {
  id: string;
  donViId: string | null;
  maDonVi: string | null;
  maLyLich: string | null;
  hoVaTen: string | null;
  biDanh: string | null;
  tenThuongGoi: string | null;
  ngaySinh: Date | null;
  gioiTinhId: string | null;
  nguyenQuanTinhId: string | null;
  nguyenQuanHuyenId: string | null;
  nguyenQuanXaId: string | null;
  nguyenQuan: string | null;
  hoKhauTinhId: string | null;
  hoKhauHuyenId: string | null;
  hoKhauXaId: string | null;
  hoKhau: string | null;
  noiOTinhId: string | null;
  noiOHuyenId: string | null;
  noiOXaId: string | null;
  noiO: string | null;
  danTocId: string | null;
  tonGiaoId: string | null;
  thanhPhanGiaDinhId: string | null;
  thanhPhanBanThan: string | null;
  trinhDoVanHoaId: string | null;
  trinhDoNgoaiNguId: string | null;
  ngayKetNapDang: Date | null;
  noiKetNapDang: string | null;
  ngayKetNapDoan: Date | null;
  noiKetNapDoan: string | null;
  tinhTrangSucKhoe: string | null;
  ngheNghiepId: string | null;
  capBac: string | null;
  luong: string | null;
  ngayNhapNgu: Date | null;
  ngayXuatNgu: Date | null;
  lyDoXuatNgu: string | null;
  anhDaiDien: string | null;
  dinhKem: string | null;
  hangThuongBinh: string | null;
  khenThuong: string | null;
  kyLuat: string | null;
  maDanhSachDeNghiKetNap: string | null;
  isKetNap: boolean | null;
  trangThai: string | null;
  maHoSoXoaTen: string | null;
  hinhThucXoaTenID: string | null;
  ngayXoaTen: Date | null;
  lyDoXoaTen: string | null;
  dinhKemXoaTen: string | null;
  isXoaTen: boolean | null;

}

