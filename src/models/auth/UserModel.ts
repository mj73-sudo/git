export class UserModel {
  username?: string;
  email?: string;
  mobileNumber?: number;
  password?: number ;
  role?: 'ROLE_USER' | 'ROLE_ADMIN';
  planTitle ?:string;
}
