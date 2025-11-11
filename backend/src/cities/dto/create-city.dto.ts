import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

