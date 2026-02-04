import type { Product } from './product.types';
import type { User } from './auth.types';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface SaleItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  userId: number;
  user: User;
  total: number;
  items: SaleItem[];
  saleDate: string;
}

export interface CreateSaleDto {
  items: {
    productId: number;
    quantity: number;
  }[];
}
