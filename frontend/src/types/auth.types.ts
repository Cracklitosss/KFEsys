export enum Role {
  ADMIN = 'admin',
  CASHIER = 'cashier',
  MANAGER = 'manager',
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
