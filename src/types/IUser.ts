import type { IPermission } from './IPermission';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;

  Permissions: {
    Permission: IPermission;
    id: string;
    permissionId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }[];

  isBlocked: boolean;

  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}
