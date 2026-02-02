import api from './api';
import { Site } from '../types';

export const siteService = {
  async getSites(): Promise<Site[]> {
    const response = await api.get<Site[]>('/sites');
    return response.data;
  },

  async getSite(id: string): Promise<Site> {
    const response = await api.get<Site>(`/sites/${id}`);
    return response.data;
  },

  async createSite(data: {
    name: string;
    code: string;
    address?: string;
    description?: string;
  }): Promise<Site> {
    const response = await api.post<Site>('/sites', data);
    return response.data;
  },

  async updateSite(id: string, data: {
    name?: string;
    code?: string;
    address?: string;
    description?: string;
  }): Promise<Site> {
    const response = await api.put<Site>(`/sites/${id}`, data);
    return response.data;
  },

  async deleteSite(id: string): Promise<void> {
    await api.delete(`/sites/${id}`);
  }
};
