import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDataStructureDto } from './dto/create-data-structure.dto';
import { UpdateDataStructureDto } from './dto/update-data-structure.dto';
import { UserRole, DataStructure, Prisma } from '@prisma/client';

@Injectable()
export class DataStructuresService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async create(dto: CreateDataStructureDto, userId: number) {
    const { contents, ...dataStructureData } = dto;
    const slug = this.generateSlug(dto.title);

    return this.prisma.dataStructure.create({
      data: {
        ...dataStructureData,
        slug,
        creator: { connect: { id: userId } },
      },
      include: {
        creator: { select: { id: true, name: true, username: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.dataStructure.findMany({
      where: { deletedAt: null },
      include: {
        creator: { select: { id: true, name: true, username: true } },
        _count: {
          select: {
            quizzes: true,
            contents: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCreator(userId: number): Promise<DataStructure[]> {
    return this.prisma.dataStructure.findMany({
      where: { createdBy: userId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        contents: {
          orderBy: {
            contentType: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const ds = await this.prisma.dataStructure.findUnique({
      where: { id, deletedAt: null },
      include: {
        creator: { select: { id: true, name: true, username: true } },
        contents: { orderBy: { updatedAt: 'desc' } },
        quizzes: { include: { questions: { include: { options: true } } } },
      },
    });
    if (!ds)
      throw new NotFoundException(`Data structure with ID ${id} not found`);
    return ds;
  }

  async update(
    id: number,
    dto: UpdateDataStructureDto,
    userId: number,
    userRole: UserRole,
  ) {
    const ds = await this.findOne(id);
    if (userRole !== UserRole.admin && ds.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this data structure',
      );
    }
    const { contents, ...updateData } = dto;
    const updatePayload: any = { ...updateData };
    if (dto.title) {
      updatePayload.slug = this.generateSlug(dto.title);
    }
    return this.prisma.dataStructure.update({
      where: { id },
      data: updatePayload,
      include: {
        creator: { select: { id: true, name: true, username: true } },
      },
    });
  }

  async remove(id: number, userId: number, userRole: UserRole) {
    const ds = await this.findOne(id);
    if (userRole !== UserRole.admin && ds.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this data structure',
      );
    }
    await this.prisma.dataStructure.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findBySlug(slug: string): Promise<any> {
    const dataStructure = await this.prisma.dataStructure.findUnique({
      where: { slug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        contents: {
          orderBy: {
            contentType: 'asc',
          },
        },
        videos: {
          select: {
            id: true,
            videoType: true,
            filePath: true,
            title: true,
            duration: true,
          },
        },
      },
    });

    if (!dataStructure) {
      throw new NotFoundException(
        `Data structure with slug '${slug}' not found`,
      );
    }

    return dataStructure;
  }

  async getVideoPath(id: string): Promise<string | null> {
    const content = await this.prisma.dataStructureContent.findUnique({
      where: { id: parseInt(id, 10) },
      select: { filePath: true },
    });

    return content?.filePath || null;
  }
}
