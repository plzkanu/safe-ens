import api from './api';
import { User } from '../types';

export const userService = {
  async getUsers(params?: {
    siteId?: string;
    role?: string;
    search?: string;
  }): Promise<User[]> {
    const response = await api.get<User[]>('/users', { params });
    return response.data;
  },

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    siteId?: string;
  }): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: string, data: {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
    siteId?: string;
  }): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
