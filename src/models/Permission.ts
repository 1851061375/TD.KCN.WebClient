export interface IPermissionResponse {
  id: string | null;
  groups?: IGroupPermission[];
}

export interface IGroupPermission {
  section: string;
  permissions: IPermission[];
}

export interface IPermission {
  value: string;
  description?: string;
  section?: string;
  active?: boolean;
}
