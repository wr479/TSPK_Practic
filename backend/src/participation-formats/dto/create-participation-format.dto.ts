import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateParticipationFormatDto {
  @ApiProperty({
    description: 'Название формата участия',
    example: 'Частное лицо',
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Описание формата участия',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Флаг активности формата',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
