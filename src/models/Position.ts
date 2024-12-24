export interface IPosition {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sortOrder?: number | null;
  isActive?: boolean;
  createdOn?: string | null;
}
