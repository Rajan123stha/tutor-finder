import { authAPI, userAPI } from '@/api';
import { RegisterUserData } from '@/types';

export class AuthService {
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static removeToken(): void {
    localStorage.removeItem('token');
  }

  static async register(data: RegisterUserData) {
    const response = await authAPI.register(data);
    return response.data;
  }

  static async login(email: string, password: string, role: string) {
    const response = await authAPI.login({ email, password, role });
    this.setToken(response.data.token);
    return response.data;
  }

  static async getCurrentUser() {
    const response = await userAPI.getMe();
    return response.data.data.user;
  }

  static async updateProfile(data: any) {
    const response = await userAPI.updateProfile(data);
    return response.data.data.user;
  }

  static logout(): void {
    this.removeToken();
    window.location.href = '/login';
  }

  static isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }
}

export const refreshToken = async (): Promise<string> => {
  // Logic to refresh the token
  const response = await api.post('/auth/refresh-token');
  return response.data.token;
};