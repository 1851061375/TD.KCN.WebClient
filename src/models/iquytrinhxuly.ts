import { IBaseExt, IBasePagination, IBaseSearch, IPickSearch } from './basemodel';

export interface IQuyTrinhXuLy extends IBaseExt {
  tenBuocXuLy: string;
  truongHopId: string;
  maTrangThaiHoSo: string;
  thoiGianXuLy: number;
  loaiThoiGian: string;
  tenNhomNguoiDung: string;
  tenTrangThaiHoSo: string;
  nhomNguoiDungId: string;
  guiEmail: boolean;
  guiSMS: boolean;
  guiLienThongQLVB: boolean;
  bieuMauEmail: string;
  bieuMauSMS: string;
  loaiBuoc: string;
  laBuocTuChuyen: boolean;
  thoiGianTuChuyen: string;
}

export type IQuyTrinhXuLyType = {
  id: string;
  tenBuocXuLy: string;
  truongHopId: string;
  maTrangThaiHoSo: string;
  thoiGianXuLy: number;
  loaiThoiGian: string;
  tenNhomNguoiDung: string;
  tenTrangThaiHoSo: string;
  nhomNguoiDungId: string;
  guiEmail: boolean;
  guiSMS: boolean;
  guiLienThongQLVB: boolean;
  bieuMauEmail: string;
  bieuMauSMS: string;
  loaiBuoc: string;
  laBuocTuChuyen: boolean;
  thoiGianTuChuyen: string;
  thoiGianThucHienTrucTuyen: number;
};
export interface IDuplicateQuyTrinhXuLy {
  id: string;
  maTruongHop: string;
}
export interface ISearchQuyTrinhXuLy extends IBasePagination, IBaseSearch, IPickSearch<IQuyTrinhXuLy> {}
