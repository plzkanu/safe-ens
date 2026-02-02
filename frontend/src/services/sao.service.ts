import api from './api';
import { SAOReport, PaginatedResponse } from '../types';

export const saoService = {
  async getSAOReports(params?: {
    siteId?: string;
    inspectorId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<SAOReport>> {
    const response = await api.get<PaginatedResponse<SAOReport>>('/sao', { params });
    return response.data;
  },

  async getSAOReport(id: string): Promise<SAOReport> {
    const response = await api.get<SAOReport>(`/sao/${id}`);
    return response.data;
  },

  async createSAOReport(data: any): Promise<SAOReport> {
    const response = await api.post<SAOReport>('/sao', data);
    return response.data;
  },

  async updateSAOReport(id: string, data: any): Promise<SAOReport> {
    const response = await api.put<SAOReport>(`/sao/${id}`, data);
    return response.data;
  },

  async deleteSAOReport(id: string): Promise<void> {
    await api.delete(`/sao/${id}`);
  }
};
