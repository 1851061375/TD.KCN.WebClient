import { INhomDanhMuc } from './NhomDanhMuc';

export interface IDanhMuc {
  id: string;
  nhomDanhMuc?: any;
  nhomDanhMucId: string | null;
  nhomDanhMucTen: string | null;
  ten: string;
  ma: string | null;
  moTa: string | null;
  thuTu: number | null;
  isActive: boolean | null;
}
