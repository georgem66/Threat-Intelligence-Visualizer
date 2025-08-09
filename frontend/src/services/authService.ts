import { apiClient } from './apiClient';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'analyst' | 'viewer';
  };
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'analyst' | 'viewer';
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser() {
    const response = await apiClient.get('/users/me');
    return response.data.user;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
}

export const authService = new AuthService();