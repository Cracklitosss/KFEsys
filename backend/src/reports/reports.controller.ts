import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.MANAGER)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-by-date')
  @ApiOperation({ summary: 'Get products sold by date range (Admin and Manager)' })
  @ApiQuery({ name: 'startDate', required: true, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: true, example: '2024-12-31' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getSalesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getProductsSoldByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top selling products (Admin and Manager)' })
  @ApiQuery({ name: 'limit', required: false, example: 3 })
  @ApiResponse({ status: 200, description: 'Top products retrieved successfully' })
  async getTopProducts(@Query('limit') limit?: string) {
    return this.reportsService.getTopSellingProducts(
      limit ? parseInt(limit) : 3,
    );
  }

  @Get('sales-by-product')
  @ApiOperation({ summary: 'Get sales by product for chart (Admin and Manager)' })
  @ApiResponse({ status: 200, description: 'Sales data retrieved successfully' })
  async getSalesByProduct() {
    return this.reportsService.getSalesByProduct();
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin and Manager)' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }
}
