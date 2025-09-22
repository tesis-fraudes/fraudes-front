export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

import type { Permission, UserRole } from "../types/roles";

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: Permission[];
  };
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: Permission[];
  };
  token: string;
}

export interface VerifyTokenResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    permissions: Permission[];
  };
}
