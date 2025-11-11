import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTariffDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

