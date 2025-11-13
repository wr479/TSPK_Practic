import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTariffDto {
  @ApiProperty({
    description: 'Название тарифа',
    example: '1 гектар',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Описание тарифа',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Стоимость, ₽',
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Флаг активности тарифа',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
