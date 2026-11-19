import { create } from 'zustand';
import api from '../utils/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nova_user') || 'null'),
  token: localStorage.getItem('nova_token') || null,
  isAuthenticated: !!localStorage.getItem('nova_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('nova_token', token);
      localStorage.setItem('nova_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async ({ name, email, password, organization }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        organization
      });
      const { user, token } = response.data;

      localStorage.setItem('nova_token', token);
      localStorage.setItem('nova_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('nova_token');
      localStorage.removeItem('nova_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      });
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/me', userData);
      const updatedUser = response.data.user;
      localStorage.setItem('nova_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Failed to update profile' };
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('nova_token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({
        user: response.data.user,
        isAuthenticated: true
      });
    } catch (err) {
      localStorage.removeItem('nova_token');
      localStorage.removeItem('nova_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));
