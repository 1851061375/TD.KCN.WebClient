import { Dayjs } from "dayjs";
import { IHoSo } from "./HoSo";

export interface IDanhSachCanCap {
    id: string | number;
    tenDanhSach: string;
    tongSoDeNghi?: number;
    deNghiCapLai?: number;
    deNghiCapMoi?: number;
    dinhKem?: string;
    trangThai?: string;
    organizationUnitId?: string | number | null;
    organizationUnitName?: string | null;
    createdOn?: string;
    thongTinThes?:Array<IThongTinThe>
    theHoiVienCapLaiId?: Array<string> 
  }
  
export interface IThongTinThe {
    id?: string | number | null;
    soTheHoiVien?: string | null,
    hoSoId: string;
    hoSo_HoVaTen?: string;
    hoSo_NgaySinh?:Dayjs | string | null;
    hoSo_NgayNhapNgu?:Dayjs | string | null;
    hoSo_HoKhau?: string;
    trangThai?: string;
    dinhKem?: string;
    danhSachCanCapId?: string | number;
}

export interface ITheHoiVienCapLai {
  id: string;
  thongTinTheId: string | number | null;
  lyDoCapLai: string;
  trangThai?: string;
  dinhKem?: string ;
  thongTinTheSoTheHoiVien?:string | null;
  ngaySinh?:Dayjs | string | null;
  ngayNhapNgu?:Dayjs | string | null;
  hoKhau?: string | null;
  hoiVien?: {
    label: string | null,
    value: string | number | null
  }
}

  