import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DataStructureContentType, ContentFormat } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({
    description: 'Type of content',
    enum: DataStructureContentType,
    example: DataStructureContentType.general,
  })
  @IsEnum(DataStructureContentType)
  @IsNotEmpty()
  contentType: DataStructureContentType;

  @ApiProperty({
    description: 'Format of the content',
    enum: ContentFormat,
    example: ContentFormat.text,
  })
  @IsEnum(ContentFormat)
  @IsNotEmpty()
  format: ContentFormat;

  @ApiProperty({
    description: 'Category of the content (optional)',
    required: false,
    example: 'Basic Concepts',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  category?: string;

  @ApiProperty({
    description: 'Name of the content',
    example: 'Introduction to Binary Search Trees',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the content',
    required: false,
    example: 'A detailed explanation of binary search trees...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'File path for video/image content (optional)',
    required: false,
    example: '/uploads/videos/binary-tree-animation.mkv',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  filePath?: string;

  @ApiProperty({
    description: 'Duration of video content in seconds (optional)',
    required: false,
    example: 120,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;
} 