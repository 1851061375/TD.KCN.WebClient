import dayjs, { Dayjs } from 'dayjs';
export interface ILyLich {
  id: string;
  donViId: string | null;
  maLyLich: string | null;
  hoVaTen: string | null;
  biDanh: string | null;
  tenThuongGoi: string | null;
  ngaySinh: string | Date | null;
  gioiTinhId: string | null;
  gioiTinh?: any | null;
  nguyenQuanTinhId: string | null;
  nguyenQuanTinh?: any | null;
  nguyenQuanHuyenId: string | null;
  nguyenQuanHuyen?: any | null;
  nguyenQuanXaId: string | null;
  nguyenQuanXa?: any | null;
  nguyenQuan: string | null;
  hoKhauTinhId: string | null;
  hoKhauTinh?: any | null;
  hoKhauHuyenId: string | null;
  hoKhauHuyen?: any | null;
  hoKhauXaId: string | null;
  hoKhauXa?: any | null;
  hoKhau: string | null;
  noiOTinhId: string | null;
  noiOTinh?: any | null;
  noiOHuyenId: string | null;
  noiOHuyen?: any | null;
  noiOXaId: string | null;
  noiOXa?: any | null;
  noiO: string | null;
  danTocId: string | null;
  danToc?: any | null;
  tonGiaoId: string | null;
  tonGiao?: any | null;
  thanhPhanGiaDinhId: string | null;
  thanhPhanGiaDinh?: any | null;
  thanhPhanBanThanId: string | null;
  thanhPhanBanThan?: any | null;
  trinhDoVanHoaId: string | null;
  trinhDoVanHoa?: any | null;
  trinhDoNgoaiNguId: string | null;
  trinhDoNgoaiNgu?: any | null;
  ngayKetNapDang: string | Date | null;
  noiKetNapDang: string | null;
  ngayKetNapDoan: string | Date | null;
  noiKetNapDoan: string | null;
  tinhTrangSucKhoe: string | null;
  ngheNghiepId: string | null;
  ngheNghiep?: any | null;
  capBac: string | null;
  luong: string | null;
  ngayNhapNgu: string | Date | null;
  ngayXuatNgu: string | Date | null;
  lyDoXuatNgu: string | null;
  anhDaiDien: string | null;
  dinhKem: string | null;
  hangThuongBinh: string | null;
  khenThuong: string | null;
  kyLuat: string | null;
  soCCCD: string | null;
  ngayCap: string | Date | null;
  noiCap: string | null;
  maDanhSachDeNghiKetNap: string | null;
  isKetNap: boolean | null;
  trangThai: string | null;
  maHoSoXoaTen: string | null;
  hinhThucXoaTenID: string | null;
  ngayXoaTen: dayjs.Dayjs | null;
  lyDoXoaTen: string | null;
  dinhKemXoaTen: string | null;
  isXoaTen: boolean | null;
  readOnly: boolean | null;
}
export interface IQuanHeGiaDinh {
  id: string;
  maHoSo: string | null;
  hoVaTen: string | null;
  quanHe: string | null;
  namSinh: string | null | Date | Dayjs;
  chucVu: string | null | any;
  readOnly: boolean | null;
  maLyLich: string | null;
}
export interface IQuaTrinhCongTac {
  id: string;
  maHoSo: string | null;
  tuNgay: string | null | Date | Dayjs;
  denNgay: string | null | Date | Dayjs;
  capBac: string | null;
  chucVu?: string | null | any;
  readOnly: boolean | null;
  maLyLich: string | null;
}
