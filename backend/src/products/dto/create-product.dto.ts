import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Café Americano' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Café negro preparado con agua caliente', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 35.50 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
