import api from './api';
import { Product, CreateProductDto, UpdateProductDto } from '../types/product.types';

export const productsService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async getActive(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/active');
    return response.data;
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(data: CreateProductDto): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
