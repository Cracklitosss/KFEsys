import api from './api';
import { Sale, CreateSaleDto } from '../types/sales.types';

export const salesService = {
  async create(data: CreateSaleDto): Promise<Sale> {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  },

  async getAll(startDate?: string, endDate?: string): Promise<Sale[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get<Sale[]>(`/sales?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<Sale> {
    const response = await api.get<Sale>(`/sales/${id}`);
    return response.data;
  },
};
