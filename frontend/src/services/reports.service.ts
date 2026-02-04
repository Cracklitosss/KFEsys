import api from './api';
import {
  SalesByDateRange,
  TopProduct,
  SalesByProduct,
  DashboardStats,
} from '../types/reports.types';

export const reportsService = {
  async getSalesByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<SalesByDateRange[]> {
    const response = await api.get<SalesByDateRange[]>(
      `/reports/sales-by-date?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data;
  },

  async getTopProducts(limit: number = 3): Promise<TopProduct[]> {
    const response = await api.get<TopProduct[]>(
      `/reports/top-products?limit=${limit}`,
    );
    return response.data;
  },

  async getSalesByProduct(): Promise<SalesByProduct[]> {
    const response = await api.get<SalesByProduct[]>('/reports/sales-by-product');
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/reports/dashboard-stats');
    return response.data;
  },
};
