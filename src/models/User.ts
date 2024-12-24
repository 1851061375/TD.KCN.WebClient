import { Dayjs } from "dayjs";

export interface IUserDetails {
  id: string;
  userName: string | null;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  phoneNumber: string | null;
  email: string | null;
  gender: string | null;
  dateOfBirth: string | null | Date | Dayjs;
  provinceCode: string | null;
  districtCode: string | null;
  wardCode: string | null;
  address: string | null;
  isActive: boolean;
  isVerified: boolean | null;
  refreshToken: string | null;
  refreshTokenExpiryTime: string;
  objectId: string | null;
  type: number | null;
  isSpecial: boolean | null;
  isDev: boolean | null;
  rawPwd: string | null;
  createdOn: string | null;
  createdBy: string | null;
  lastModifiedBy: string | null;
  lastModifiedOn: string | null;
  deletedOn: string | null;
  deletedBy: string | null;
  permissions: string[] | null;
  officeId: string | null;
}

export interface IUserDto {
  id: string;
  userName: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  isActive: boolean;
  isVerified: boolean | null;
  type: number | null;
  isSpecial: boolean | null;
  isDev: boolean | null;
  createdOn: string | null;
  createdBy: string | null;
  organizationUnitName: string | null;
  positionName: string | null;
}

export interface IUserOrganizationPositionDto {
  id: string;
  userId: string;
  userName: string | null;
  fullName: string | null;
  imageUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
  userCreatedOn: string | null;
  organizationUnitName: string | null;
  positionName: string | null;
  organizationUnitId: string;
  positionId: string;
  isMain: boolean;
  fromDate: string | null;
  toDate: string | null;
  status: UserOrgPositionStatus;
}

export enum UserOrgPositionStatus {
  Active = 1,
  Inactive = 2,
  Terminated = 3,
}
