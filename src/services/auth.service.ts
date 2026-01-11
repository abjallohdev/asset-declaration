import { api } from "@/lib/api";
import { User } from "@/lib/mock-data";

export interface LoginResponse {
  user: User;
  token?: string; // JWT for future
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    // In a real app, we would save the token here
    if (response.token) {
        localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  logout: async () => {
    await api.post('/api/auth/logout', {});
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/api/auth/me');
  }
};
