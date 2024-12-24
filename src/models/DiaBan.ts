import internal from "stream";

export interface IDiaBan {
  id: string;
  ten: string;
  ma: string | null;
  maCha: string | null;
  loai: string | null;
  tenDayDu: string | null;
  cap: internal | null;
  isActive: boolean | null;
  createdOn: string | null;
}
