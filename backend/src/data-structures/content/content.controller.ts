import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from 'common/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ContentEntity } from './entities/content.entity';

@Controller('data-structures/:structureId/content')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Create new content for a data structure',
    description: 'Create new content. Available to teachers and admins only.',
  })
  @ApiResponse({
    status: 201,
    description: 'The content has been successfully created.',
    type: ContentEntity,
  })
  create(
    @Param('structureId', ParseIntPipe) structureId: number,
    @Body() createContentDto: CreateContentDto,
    @GetUser('id') userId: number,
  ) {
    return this.contentService.create(structureId, createContentDto, userId);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get all content for a data structure',
    description: 'Get all content. Available to all authenticated users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all content.',
    type: [ContentEntity],
  })
  findAll(@Param('structureId', ParseIntPipe) structureId: number) {
    return this.contentService.findAll(structureId);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get content by id',
    description: 'Get specific content. Available to all authenticated users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the content.',
    type: ContentEntity,
  })
  findOne(
    @Param('structureId', ParseIntPipe) structureId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contentService.findOne(structureId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Update content',
    description: 'Update content. Available to teachers and admins only.',
  })
  @ApiResponse({
    status: 200,
    description: 'The content has been successfully updated.',
    type: ContentEntity,
  })
  update(
    @Param('structureId', ParseIntPipe) structureId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto,
    @GetUser('id') userId: number,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.contentService.update(
      structureId,
      id,
      updateContentDto,
      userId,
      userRole,
    );
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Delete content',
    description: 'Delete content. Available to teachers and admins only.',
  })
  @ApiResponse({
    status: 200,
    description: 'The content has been successfully deleted.',
  })
  remove(
    @Param('structureId', ParseIntPipe) structureId: number,
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.contentService.remove(structureId, id, userId, userRole);
  }

  @Get(':id/history')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Get content edit history',
    description: 'Get content edit history. Available to teachers and admins only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return content edit history.',
  })
  getHistory(
    @Param('structureId', ParseIntPipe) structureId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contentService.getHistory(structureId, id);
  }
} 