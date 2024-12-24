import { DataNode } from 'antd/es/tree';
import { SearchData } from '@/types';

export interface DataTableProps {
  searchData?: SearchData;
}

export interface UseDataTableProps {
  searchData?: SearchData;
  initialPageSize?: number;
}

export type dataModal = {

  donViId: string;
  maDonVi: string;
  tenDonVi: string;
  id: string;
  trangThai: string;
  viTri: string;
  mode: string;
} | undefined;

export type DonVi = {
  donViId: string;
  maDonVi: string;
  tenDonVi: string;
} | undefined;

export interface Profile {
  officeId: string;
}

export interface TreeNode extends DataNode {
  id: string;
  name: string;
  code: string;
  children?: TreeNode[];
}

export interface CoCauToChucTreeProps {
  onNodeSelect: (id: string, code: string, name: string) => void;
}