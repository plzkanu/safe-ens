import api from './api';
import { PatrolLog, PaginatedResponse } from '../types';

export const patrolService = {
  async getPatrolLogs(params?: {
    siteId?: string;
    inspectorId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PatrolLog>> {
    const response = await api.get<PaginatedResponse<PatrolLog>>('/patrol', { params });
    return response.data;
  },

  async getPatrolLog(id: string): Promise<PatrolLog> {
    const response = await api.get<PatrolLog>(`/patrol/${id}`);
    return response.data;
  },

  async createPatrolLog(data: any): Promise<PatrolLog> {
    const response = await api.post<PatrolLog>('/patrol', data);
    return response.data;
  },

  async updatePatrolLog(id: string, data: any): Promise<PatrolLog> {
    const response = await api.put<PatrolLog>(`/patrol/${id}`, data);
    return response.data;
  },

  async deletePatrolLog(id: string): Promise<void> {
    await api.delete(`/patrol/${id}`);
  }
};
