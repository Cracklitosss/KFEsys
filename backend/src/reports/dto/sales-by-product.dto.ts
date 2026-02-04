import { ApiProperty } from '@nestjs/swagger';

export class SalesByProductDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  totalSales: number;
}
