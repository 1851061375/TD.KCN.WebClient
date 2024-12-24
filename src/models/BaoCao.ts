import { DefaultOptionType } from "antd/es/select";
import dayjs from "dayjs";

//#region Enum
export enum LoaiChiTieuEnum {
  ChiTieu = 0,
  DanhSach = 1,
}

export enum BoLocBaoCaoEnum {
  DanhSach = -1,
  ChoDuyet = 0,
  DaDuyet = 1,
}

export enum TrangThaiDuyetBaoCaoEnum {
  TuChoi = -1,
  ChoDuyet = 0,
  DongY = 1,
}

export enum TrangThaiBaoCaoEnum {
  QuaHan = -1,
  ChuaDenHan = 0,
  DenHan = 1,
}

export enum TrangThaiNopBaoCaoEnum {
  ChuaNop = -1,
  ChoDuyet = 0,
  DaDuyet = 1,
  //TuChoi = 2,
}
export enum HanhDongNhacViecBaoCaoEnum {
  Cuon = 0,
  ChuyenHuong = 1
}
//#endregion
//#region Dto
export interface IDonViTinhDto {
  id: string;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface IKyBaoCaoDto {
  id: string;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface ISoKyBaoCaoDto {
  id: string;
  kyBaoCaoId: string | null;
  kyBaoCaoTen: string | null;
  kyBaoCao: DefaultOptionType | null;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface ILoaiBaoCaoDto {
  id: string;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface ILoaiKyDuLieuDto {
  id: string;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface ILoaiTongHopDto {
  id: string;
  ten: string;
  ma: string | null;
  loaiBaoCaoId: string | null;
  loaiBaoCao: DefaultOptionType | null;
  loaiBaoCaoTen: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
  dinhKem: string | null;
}

export interface IChiTieuBaoCaoDto {
  id: string;
  ten: string;
  ma: string | null;
  // 0: chỉ tiêu, 1: danh sách
  loaiChiTieu: LoaiChiTieuEnum;
  donViTinhId: string | null;
  donViTinh: DefaultOptionType | null;
  donViTinhTen: string | null;
  chiTieuChaId: string | null;
  chiTieuChaTen: string | null;
  layDuLieu: boolean | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface IBieuMauBaoCaoDto {
  id: string;
  loaiBaoCaoId: string | null;
  loaiBaoCaoTen: string | null;
  loaiBaoCao: DefaultOptionType | null;
  kyBaoCaoId: string | null;
  kyBaoCaoTen: string | null;
  kyBaoCao: DefaultOptionType | null;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  coLayGiaTri: boolean | null;
  suDung: boolean | null;
  dungChoDoanhNghiep: string;
  dinhKem: string;
}

export interface IBangTrongMauBaoCaoDto {
  id: string;
  bieuMauBaoCaoId: string;
  bieuMauBaoCaoTen: string;
  ten: string;
  ma: string | null;
  loaiBang: LoaiChiTieuEnum;
  loaiKyDuLieuIds: string | null;
  loaiKyDuLieu: DefaultOptionType[] | null;
  viTriBatDau: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
}

export interface IChiTieuTrongBangBaoCaoDto {
  id: string;
  bieuMauBaoCaoId: string;
  bangTrongMauBaoCaoId: string;
  chiTieuBaoCaoId: string;
  chiTieuBaoCaoTen: string;
  chiTieuBaoCaoMa: string;
  maChiTieu: string;
  chiTieuChaId: string;
  laTruongBatBuoc: boolean | null;
  coLayGiaTri: boolean | null;
}

export interface IKyHanNopBaoCaoDto {
  id: string;
  kyBaoCao: DefaultOptionType | null;
  kyBaoCaoId: string | null;
  kyBaoCaoTen: string | null;
  soKyBaoCaoId: string | null;
  soKyBaoCaoTen: string | null;
  soKyBaoCao: DefaultOptionType | null;
  bieuMauBaoCaoId: string | null;
  bieuMauBaoCaoTen: string | null;
  bieuMauBaoCao: DefaultOptionType | null;
  kyHanNop: dayjs.Dayjs;
  nopTruocHan: number | null;
  suDung: boolean | null;
}

export interface IBaoCaoDto {
  ten: string | null;
  ma: string | null;
  bieuMauBaoCaoId: string | null;
  bieuMauBaoCaoTen: string | null;
  bieuMauBaoCaoMa: string | null;
  bieuMauBaoCao: DefaultOptionType | null;
  kyHanNopBaoCaoId: string | null;
  kyHanNopBaoCaoTen: string | null;
  kyHanNopBaoCao: DefaultOptionType | null;
  loaiBaoCaoId: string | null;
  loaiBaoCaoTen: string | null;
  loaiBaoCao: DefaultOptionType | null;
  kyBaoCaoId: string | null;
  kyBaoCaoTen: string | null;
  kyBaoCaoMa: string | null;
  kyBaoCao: DefaultOptionType | null;
  soKyBaoCaoId: string | null;
  soKyBaoCaoTen: string | null;
  soKyBaoCaoMa: string | null;
  soKyBaoCao: DefaultOptionType | null;
  namBaoCao: number | null;
  ngayBatDau: dayjs.Dayjs | null;
  hanNop: dayjs.Dayjs | null;
  ngayNopBaoCao: dayjs.Dayjs | null;
  trangThaiBaoCao: TrangThaiBaoCaoEnum;
  trangThaiBaoCaoTen: string | null;
  trangThaiDuyetBaoCao: TrangThaiDuyetBaoCaoEnum;
  moTa: string | null;
  baoCaoDaNopId: string | null;
  dinhKem: string | null;
  dinhKemScan: string | null;
  readOnly: boolean | null;
}


export interface IBaoCaoDaNopDto {
  id: string;
  ma: string | null;
  organizationUnitId: string | null;
  organizationUnit: DefaultOptionType | null;
  organizationUnitName: string | null;
  bieuMauBaoCaoId: string | null;
  bieuMauBaoCaoTen: string | null;
  bieuMauBaoCao: DefaultOptionType | null;
  kyHanNopBaoCaoId: string | null;
  kyBaoCaoId: string | null;
  kyBaoCaoTen: string | null;
  kyBaoCao: DefaultOptionType | null;
  soKyBaoCaoId: string | null;
  soKyBaoCaoTen: string | null;
  soKyBaoCao: DefaultOptionType | null;
  namBaoCao: number | null;
  ngayBatDau: dayjs.Dayjs | null;
  hanNop: dayjs.Dayjs | null;
  ngayNopBaoCao: dayjs.Dayjs | null;
  trangThaiDuyetBaoCao: TrangThaiDuyetBaoCaoEnum;
  dinhKem: string | null;
  dinhKemScan: string | null;
  readOnly: boolean | null;
}

export interface ITongHopBaoCaoDto {
  organizationUnitId: string;
  organizationUnitName: string | null;
  organizationUnitCode: string | null;
  baoCaoDaNopId: string | null;
  loaiBaoCaoId: string | null;
  loaiBaoCaoTen: string | null;
  loaiBaoCao: DefaultOptionType | null;
  ngayNopBaoCao: dayjs.Dayjs | null;
  dinhKem: string | null;
  dinhKemScan: string | null;
}

export interface INhacViecBaoCaoDto {
  id: string;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  suDung: boolean | null;
  hanhDong: HanhDongNhacViecBaoCaoEnum | null;
  dich: string | null;
}
//#endregion
