import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ProductsService } from '../products/products.service';
import { StockGateway } from '../websockets/stock.gateway';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private readonly saleItemRepository: Repository<SaleItem>,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
    private readonly stockGateway: StockGateway,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: number): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let total = 0;
      const saleItems: SaleItem[] = [];

      for (const item of createSaleDto.items) {
        const product = await this.productsService.findOne(item.productId);

        if (!product.isActive) {
          throw new BadRequestException(`Product ${product.name} is not active`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
          );
        }

        const subtotal = product.price * item.quantity;
        total += subtotal;

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const saleItem = this.saleItemRepository.create({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal,
        });
        saleItems.push(saleItem);
      }

      const sale = this.saleRepository.create({
        userId,
        total,
        items: saleItems,
      });

      const savedSale = await queryRunner.manager.save(sale);
      await queryRunner.commitTransaction();

      for (const item of createSaleDto.items) {
        const product = await this.productsService.findOne(item.productId);
        this.stockGateway.notifyStockUpdate(product.id, product.stock);
      }

      const completeSale = await this.findOne(savedSale.id);
      this.stockGateway.notifyNewSale(completeSale);

      return completeSale;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({
      relations: ['user', 'items', 'items.product'],
      order: { saleDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('sale.saleDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('sale.saleDate', 'DESC')
      .getMany();
  }
}
