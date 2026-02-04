export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  category?: Category;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
