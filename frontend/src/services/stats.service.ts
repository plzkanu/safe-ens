import api from './api';
import { DashboardStats, ComplianceData, MonthlyTrendData } from '../types';

export const statsService = {
  async getDashboardStats(params?: {
    siteId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/stats/dashboard', { params });
    return response.data;
  },

  async getComplianceRate(params?: {
    siteId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ period: { start: string; end: string }; data: ComplianceData[] }> {
    const response = await api.get('/stats/compliance', { params });
    return response.data;
  },

  async getMonthlyTrend(params?: {
    siteId?: string;
    months?: number;
  }): Promise<{ data: MonthlyTrendData[] }> {
    const response = await api.get('/stats/trend/monthly', { params });
    return response.data;
  },

  async getNonCompliantUsers(params?: {
    siteId?: string;
  }): Promise<any> {
    const response = await api.get('/stats/non-compliant', { params });
    return response.data;
  }
};
