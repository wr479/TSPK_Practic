import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
  IsString,
} from 'class-validator';

export class CreateIndividualApplicationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsEmail()
  email: string;

  @IsUUID()
  cityId: string;

  @IsUUID()
  participationFormatId: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

