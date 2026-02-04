export interface SalesByDateRange {
  productId: number;
  productName: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
  salesCount: number;
}

export interface SalesByProduct {
  productName: string;
  totalSales: number;
}

export interface DashboardStats {
  todaySales: number;
  todayRevenue: number;
  totalSales: number;
  totalRevenue: number;
}
