import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { SaleItem } from '../sales/entities/sale-item.entity';
import { SalesByDateRangeDto } from './dto/sales-by-date-range.dto';
import { TopProductDto } from './dto/top-products.dto';
import { SalesByProductDto } from './dto/sales-by-product.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
  ) {}

  async getProductsSoldByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<SalesByDateRangeDto[]> {
    const results = await this.saleItemRepository
      .createQueryBuilder('saleItem')
      .innerJoin('saleItem.sale', 'sale')
      .innerJoin('saleItem.product', 'product')
      .leftJoin('product.category', 'category')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('category.name', 'category')
      .addSelect('SUM(saleItem.quantity)', 'totalQuantity')
      .addSelect('SUM(saleItem.subtotal)', 'totalRevenue')
      .where('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('category.name')
      .orderBy('totalRevenue', 'DESC')
      .getRawMany();

    return results.map((result) => ({
      productId: result.productId,
      productName: result.productName,
      category: result.category || 'Sin categoría',
      totalQuantity: parseInt(result.totalQuantity),
      totalRevenue: parseFloat(result.totalRevenue),
    }));
  }

  async getTopSellingProducts(limit: number = 3): Promise<TopProductDto[]> {
    const results = await this.saleItemRepository
      .createQueryBuilder('saleItem')
      .innerJoin('saleItem.product', 'product')
      .leftJoin('product.category', 'category')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('category.name', 'category')
      .addSelect('SUM(saleItem.quantity)', 'totalQuantity')
      .addSelect('SUM(saleItem.subtotal)', 'totalRevenue')
      .addSelect('COUNT(DISTINCT saleItem.saleId)', 'salesCount')
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('category.name')
      .orderBy('totalQuantity', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((result) => ({
      productId: result.productId,
      productName: result.productName,
      category: result.category || 'Sin categoría',
      totalQuantity: parseInt(result.totalQuantity),
      totalRevenue: parseFloat(result.totalRevenue),
      salesCount: parseInt(result.salesCount),
    }));
  }

  async getSalesByProduct(): Promise<SalesByProductDto[]> {
    const results = await this.saleItemRepository
      .createQueryBuilder('saleItem')
      .innerJoin('saleItem.product', 'product')
      .select('product.name', 'productName')
      .addSelect('SUM(saleItem.subtotal)', 'totalSales')
      .groupBy('product.name')
      .orderBy('totalSales', 'DESC')
      .getRawMany();

    return results.map((result) => ({
      productName: result.productName,
      totalSales: parseFloat(result.totalSales),
    }));
  }

  async getDashboardStats() {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const todaySales = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: startOfToday,
        end: endOfToday,
      })
      .getCount();

    const todayRevenue = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'total')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: startOfToday,
        end: endOfToday,
      })
      .getRawOne();

    const totalSales = await this.saleRepository.count();

    const totalRevenue = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'total')
      .getRawOne();

    return {
      todaySales,
      todayRevenue: parseFloat(todayRevenue?.total || '0'),
      totalSales,
      totalRevenue: parseFloat(totalRevenue?.total || '0'),
    };
  }
}
