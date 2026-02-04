import { ApiProperty } from '@nestjs/swagger';

export class SalesByDateRangeDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalRevenue: number;
}
