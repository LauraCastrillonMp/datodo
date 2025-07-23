import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import {
  UserRole,
  DataStructureContent,
  ContentEditLog,
} from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(
    structureId: number,
    createContentDto: CreateContentDto,
    userId: number,
  ): Promise<DataStructureContent> {
    // Verify data structure exists
    const dataStructure = await this.prisma.dataStructure.findUnique({
      where: { id: structureId },
    });

    if (!dataStructure) {
      throw new NotFoundException(
        `Data structure with ID ${structureId} not found`,
      );
    }

    // Create content
    const content = await this.prisma.dataStructureContent.create({
      data: {
        ...createContentDto,
        dataStructureId: structureId,
      },
    });

    // Create edit log
    await this.prisma.contentEditLog.create({
      data: {
        contentId: content.id,
        editedBy: userId,
        changesSummary: 'Content created',
      },
    });

    return content;
  }

  async findAll(structureId: number): Promise<DataStructureContent[]> {
    console.log('🔍 ContentService.findAll called with structureId:', structureId);
    
    // Verify data structure exists
    const dataStructure = await this.prisma.dataStructure.findUnique({
      where: { id: structureId },
    });

    if (!dataStructure) {
      console.log('❌ Data structure not found:', structureId);
      throw new NotFoundException(
        `Data structure with ID ${structureId} not found`,
      );
    }

    console.log('✅ Data structure found:', dataStructure.title);

    const content = await this.prisma.dataStructureContent.findMany({
      where: { dataStructureId: structureId },
    });

    console.log('📊 Content found:', content.length);
    return content;
  }

  async findOne(
    structureId: number,
    id: number,
  ): Promise<DataStructureContent> {
    const content = await this.prisma.dataStructureContent.findFirst({
      where: {
        id,
        dataStructureId: structureId,
      },
    });

    if (!content) {
      throw new NotFoundException(
        `Content with ID ${id} not found in data structure ${structureId}`,
      );
    }

    return content;
  }

  async update(
    structureId: number,
    id: number,
    updateContentDto: UpdateContentDto,
    userId: number,
    userRole: UserRole,
  ): Promise<DataStructureContent> {
    await this.findOne(structureId, id);

    // Check if user has permission to edit
    if (userRole !== UserRole.admin) {
      const dataStructure = await this.prisma.dataStructure.findUnique({
        where: { id: structureId },
      });

      if (dataStructure.createdBy !== userId) {
        throw new ForbiddenException(
          'You do not have permission to update this content',
        );
      }
    }

    // Update content
    const updatedContent = await this.prisma.dataStructureContent.update({
      where: { id },
      data: updateContentDto,
    });

    // Create edit log
    await this.prisma.contentEditLog.create({
      data: {
        contentId: id,
        editedBy: userId,
        changesSummary: 'Content updated',
      },
    });

    return updatedContent;
  }

  async remove(
    structureId: number,
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<DataStructureContent> {
    await this.findOne(structureId, id);

    // Check if user has permission to delete
    if (userRole !== UserRole.admin) {
      const dataStructure = await this.prisma.dataStructure.findUnique({
        where: { id: structureId },
      });

      if (dataStructure.createdBy !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this content',
        );
      }
    }

    return this.prisma.dataStructureContent.delete({
      where: { id },
    });
  }

  async getHistory(
    structureId: number,
    id: number,
  ): Promise<(ContentEditLog & {
    editor: {
      id: number;
      name: string;
      username: string;
    };
  })[]> {
    await this.findOne(structureId, id);

    return this.prisma.contentEditLog.findMany({
      where: { contentId: id },
      include: {
        editor: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        editedAt: 'desc',
      },
    });
  }
} 