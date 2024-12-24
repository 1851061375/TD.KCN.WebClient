export interface IOrganizationUnitDetails {
  id: string;
  parentId: string | null;
  name: string | null;
  code: string | null;
  shortcutName: string | null;
  fullCode: string | null;
  fullParentIds: string | null;
  parentCode: string | null;
  isParent: boolean | null;
  type: number | null;
  description: string | null;
  sortOrder: number | null;
  isActive: boolean | null;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  taxCode: string | null;
  mainTask: string | null;
}
