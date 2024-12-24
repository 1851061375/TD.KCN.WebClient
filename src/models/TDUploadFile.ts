import { UploadFile } from 'antd/es/upload/interface';

export interface TDUploadFile extends UploadFile {
  name: string;
  type: string;
  url: string;
  size: number;
  path: string | null | undefined;
}
