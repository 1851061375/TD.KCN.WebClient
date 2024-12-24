import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
export interface IHoSoXoaTen {
  id: string;
  tenHoSo: string | null;
  maHoSo: string | null;
  soNguoi: number | null;
  ngayGui: dayjs.Dayjs | null;
  ngayDuyet: dayjs.Dayjs | null;
  trangThai: string | null;
  ghiChu: string | null;
  dinhKem: string | null;
  keHoachId: string | null;
  donViId: string | null;
  maDonVi: string | null;
  tenDonVi: string | null;
  lyDoTraVe: string | null;
  dinhKemLyDoTraVe: string | null;
  viTri: string | null;
  listHoSoId: string | null;
  dinhKemXaPhuongXetDuyet: string | null;
  dinhKemQuanHuyenXetDuyet: string | null;
}

export interface IXetDuyetXoaTen {
  id: string | null;
  trangThaiXoaTen: string | null;
  isXoaTen: boolean | null;
  hinhThucXoaTenId: any | null;
  tenhinhThucXoaTen: string | null; 
  ngayXoaTen: dayjs.Dayjs | null;
  lyDoXoaTen: string | null;
  dinhKemXoaTen: string | null;
  hoVaTen: string | null;
  tenDonVi: string | null;
  soTheCCB: string | null;
  soQuyetDinhXoaTen: string | null;
  ngaySinh: dayjs.Dayjs | null;
  
}
export interface ITrangThaiXoaTen {
  listHoSoId: string | null;
  trangThaiXoaTen: string | null;
  isXoaTen: boolean | null;
  ngayXoaTen: dayjs.Dayjs | null;
}
