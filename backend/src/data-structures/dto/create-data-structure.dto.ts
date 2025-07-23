import {
  IsEnum,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DataStructureDifficulty, DataStructureContentType, ContentFormat } from '@prisma/client';

export class CreateDataStructureContentDto {
  @IsEnum(DataStructureContentType)
  @IsNotEmpty()
  contentType: DataStructureContentType;

  @IsEnum(ContentFormat)
  @IsNotEmpty()
  format: ContentFormat;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  complexity?: string;
}

export class CreateDataStructureDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsEnum(DataStructureDifficulty)
  @IsNotEmpty()
  difficulty: DataStructureDifficulty;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDataStructureContentDto)
  @IsOptional()
  contents?: CreateDataStructureContentDto[];
}
