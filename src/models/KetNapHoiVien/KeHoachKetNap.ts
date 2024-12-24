import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
export interface IKeHoachKetNap {
  id: string;
  tenKeHoach: string | null;
  maKeHoach: string | null;
  noiDungKeHoach: string | null;
  chiTieuKeHoach: number | null;
  ketQuaThucHien: number | null;
  nam: dayjs.Dayjs | null;
  nhiemKy: string | null;
  ghiChu: string | null;
  dinhKemKeHoach: string | null;
  donViId: string | null;
  maDonVi: string | null;
  tenDonVi: string | null;
  dinhKemBaoCao: string | null;
  ghiChuBaoCao: string | null;
  isNopBaoCao: boolean | null;
}
