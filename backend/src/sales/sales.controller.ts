import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Sales')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CASHIER)
  @ApiOperation({ summary: 'Create a new sale (Admin and Cashier)' })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or invalid product' })
  create(@Body() createSaleDto: CreateSaleDto, @CurrentUser() user: any) {
    return this.salesService.create(createSaleDto, user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Get all sales (Admin and Manager)' })
  @ApiResponse({ status: 200, description: 'Sales retrieved successfully' })
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (startDate && endDate) {
      return this.salesService.findByDateRange(new Date(startDate), new Date(endDate));
    }
    return this.salesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }
}
