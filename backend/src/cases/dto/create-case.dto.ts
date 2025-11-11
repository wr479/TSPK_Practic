import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

