import { ApiProperty } from '@nestjs/swagger';

export class TopProductDto {
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

  @ApiProperty()
  salesCount: number;
}
