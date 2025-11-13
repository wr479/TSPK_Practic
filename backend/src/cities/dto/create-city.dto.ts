import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    description: 'Название города',
    example: 'Москва',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Флаг активности',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
