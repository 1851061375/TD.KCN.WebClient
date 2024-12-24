export interface ILoginLogs {
  id: string;
  userName: string;
  fullName: string;
  imageUrl: string;
  userId: string;
  ip: string;
  userAgent: string;
  browserName: string;
  operatingSystem: string;
  type?: string;
  createdOn: string;
}
