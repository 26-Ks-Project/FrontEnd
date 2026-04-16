import api from './api';

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  accessTokenExpiresIn: number;
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
  }
};
