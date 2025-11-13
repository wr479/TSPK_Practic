import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  IsString,
} from 'class-validator';

export class CreateIndividualApplicationDto {
  @ApiProperty({
    description: 'Полное имя участника',
    example: 'Иван Иванов',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Контактный телефон',
    example: '+7 (999) 123-45-67',
  })
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Электронная почта',
    example: 'participant@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Идентификатор выбранного города',
    format: 'uuid',
  })
  @IsUUID()
  cityId: string;

  @ApiProperty({
    description: 'Идентификатор формата участия',
    format: 'uuid',
  })
  @IsUUID()
  participationFormatId: string;

  @ApiPropertyOptional({
    description: 'Комментарий участника',
    example: 'Хочу посадить дерево в честь дедушки',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
