import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCompanyApplicationDto {
  @ApiProperty({
    description: 'Название компании-заявителя',
    example: 'ООО «Лесные друзья»',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Контактное лицо',
    example: 'Иван Петров',
  })
  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @ApiProperty({
    description: 'Контактный телефон',
    example: '+7 (495) 700-00-00',
  })
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Электронная почта',
    example: 'eco@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Идентификатор выбранного тарифа',
    format: 'uuid',
  })
  @IsUUID()
  tariffId: string;

  @ApiPropertyOptional({
    description: 'Комментарий или пожелания компании',
    example: 'Хотим провести посадку для руководства',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
