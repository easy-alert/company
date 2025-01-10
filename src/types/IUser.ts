export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;

  isBlocked: boolean;

  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}
