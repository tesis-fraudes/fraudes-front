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

// Nuevos tipos para los endpoints reales
export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  role_id: number;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequestReal {
  email: string;
  password: string;
  role_id: number;
}

export interface LoginResponseReal {
  success: boolean;
  message: string;
  user_id?: number;
  user?: UserData;
  token?: string;
}
