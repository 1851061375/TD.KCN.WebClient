export interface IAdministrativeUnit {
  id: string;
  name: string;
  code: string;
  parentCode: string | null;
  nameEn: string | null;
  type: string | null;
  level: number;
  path: string | null;
  pathWithType: string | null;
  nameWithType: string | null;
  description: string | null;
  sortOrder: number | null;
  isActive: boolean;
}
