import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCompanyApplicationDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsEmail()
  email: string;

  @IsUUID()
  tariffId: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

