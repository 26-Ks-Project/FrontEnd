import api from './api';

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  accessTokenExpiresIn: number;
}

export interface UserLevelResponse {
  xp: number;
  level: number;
  nextLevelXp: number;
  remainingXp: number;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    
    if (response.data.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('accessToken');
  },

  getCurrentLevel: async (userId: number): Promise<UserLevelResponse> => {
    const response = await api.get<UserLevelResponse>(`/auth/cur-level?userId=${userId}`);
    return response.data;
  }
};

