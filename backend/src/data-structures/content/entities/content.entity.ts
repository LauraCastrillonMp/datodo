import { DataStructureContent } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ContentEntity implements DataStructureContent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  dataStructureId: number;

  @ApiProperty({ enum: ['general', 'property', 'operation', 'application', 'resource'] })
  contentType: 'general' | 'property' | 'operation' | 'application' | 'resource';

  @ApiProperty({ enum: ['text', 'video', 'image', 'link'] })
  format: 'text' | 'video' | 'image' | 'link';

  @ApiProperty({ required: false, nullable: true })
  category: string | null;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true })
  filePath: string | null;

  @ApiProperty({ required: false, nullable: true })
  duration: number | null;

  @ApiProperty({ required: false, nullable: true })
  complexity: string | null;

  @ApiProperty()
  updatedAt: Date;
} 