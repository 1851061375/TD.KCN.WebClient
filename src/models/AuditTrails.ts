export interface IAuditTrails {
  id: string | number;
  userId: string;
  fullName?: string;
  imageUrl?: string;
  userName?: string;
  type: string;
  tableName: string;
  dateTime: string;
  oldValues?: string;
  newValues?: string;
  affectedColumns?: string;
  primaryKey?: string;
}
