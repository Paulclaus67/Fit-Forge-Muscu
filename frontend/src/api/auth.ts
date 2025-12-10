// src/api/auth.ts
import { api } from './client';

export interface User {
  id: number;
  email: string;
  username: string;
  profilePicture?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', {
    email,
    username,
    password,
  });
}

export async function login(
  emailOrUsername: string,
  password: string
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', {
    emailOrUsername,
    password,
  });
}

export async function updateProfilePicture(
  token: string,
  profilePicture: string
): Promise<{ user: User }> {
  return api.put<{ user: User }>(
    '/auth/profile-picture',
    { profilePicture },
    token
  );
}
