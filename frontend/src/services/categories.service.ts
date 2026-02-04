import api from './api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/product.types';

export const categoriesService = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
