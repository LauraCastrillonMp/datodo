import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DataStructuresService } from './data-structures.service';
import { QuizService } from './quiz/quiz.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDataStructureDto } from './dto/create-data-structure.dto';
import { UpdateDataStructureDto } from './dto/update-data-structure.dto';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizAttemptDto } from './quiz/dto/quiz-attempt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DataStructureEntity } from './entity/data-structure.dto';

@ApiTags('data-structures')
@Controller('data-structures')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DataStructuresController {
  constructor(
    private readonly dataStructuresService: DataStructuresService,
    private readonly quizService: QuizService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Create a new data structure',
    description:
      'Create a new data structure. Available to teachers and admins only.',
  })
  @ApiResponse({
    status: 201,
    description: 'The data structure has been successfully created.',
    type: DataStructureEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateDataStructureDto, @Req() req: RequestWithUser) {
    return this.dataStructuresService.create(dto, req.user.id);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get all data structures',
    description:
      'Get all data structures. Available to all authenticated users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all data structures.',
    type: [DataStructureEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.dataStructuresService.findAll();
  }

  @Get('me')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Get data structures created by the current user',
    description:
      'Get data structures created by the current user. Available to teachers and admins only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return data structures created by the current user.',
    type: [DataStructureEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findByCreator(@Req() req: RequestWithUser) {
    return this.dataStructuresService.findByCreator(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get a data structure by id',
    description:
      'Get a specific data structure by its ID. Available to all authenticated users.',
  })
  @ApiParam({ name: 'id', description: 'Data structure id' })
  @ApiResponse({
    status: 200,
    description: 'Return the data structure.',
    type: DataStructureEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  findOne(@Param('id') id: string) {
    return this.dataStructuresService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Update a data structure',
    description:
      'Update a data structure. Available to teachers and admins only.',
  })
  @ApiParam({ name: 'id', description: 'Data structure id' })
  @ApiResponse({
    status: 200,
    description: 'The data structure has been successfully updated.',
    type: DataStructureEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDataStructureDto,
    @Req() req: RequestWithUser,
  ) {
    return this.dataStructuresService.update(
      +id,
      dto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiTags('admin')
  @ApiOperation({
    summary: 'Delete a data structure',
    description: 'Delete a data structure. Available to admins only.',
  })
  @ApiParam({ name: 'id', description: 'Data structure id' })
  @ApiResponse({
    status: 200,
    description: 'The data structure has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.dataStructuresService.remove(+id, req.user.id, req.user.role);
  }

  // Quiz endpoints
  @Post(':id/quizzes')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Create a new quiz for a data structure',
    description:
      'Create a new quiz for a data structure. Available to teachers and admins only.',
  })
  @ApiParam({ name: 'id', description: 'Data structure id' })
  @ApiResponse({
    status: 201,
    description: 'Quiz has been successfully created',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  createQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() createQuizDto: CreateQuizDto,
    @Req() req: RequestWithUser,
  ) {
    return this.quizService.create(id, createQuizDto, req.user.id);
  }

  @Get(':id/quizzes')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get all quizzes for a data structure',
    description:
      'Get all quizzes for a data structure. Available to all authenticated users.',
  })
  @ApiParam({ name: 'id', description: 'Data structure id' })
  @ApiResponse({
    status: 200,
    description: 'Return all quizzes',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  findAllQuizzes(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.findAll(id);
  }

  @Get('quizzes/:quizId')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get a quiz by ID',
    description:
      'Get a specific quiz by its ID. Available to all authenticated users.',
  })
  @ApiParam({ name: 'quizId', description: 'Quiz id' })
  @ApiResponse({
    status: 200,
    description: 'Return the quiz',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  async findOneQuiz(@Param('quizId', ParseIntPipe) quizId: number) {
    // First get the quiz to find its structureId
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { dataStructureId: true },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    return this.quizService.findOne(quiz.dataStructureId, quizId);
  }

  @Post('quizzes/:quizId/submit')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Submit answers for a quiz',
    description:
      'Submit answers for a quiz. Available to all authenticated users.',
  })
  @ApiParam({ name: 'quizId', description: 'Quiz id' })
  @ApiResponse({
    status: 200,
    description: 'Quiz has been successfully submitted',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  async submitQuiz(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Req() req: RequestWithUser,
    @Body() attemptDto: QuizAttemptDto,
  ) {
    // First get the quiz to find its structureId
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { dataStructureId: true },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    return this.quizService.submitAttempt(
      quiz.dataStructureId,
      quizId,
      attemptDto,
      req.user.id,
    );
  }

  @Delete('quizzes/:quizId')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiTags('teacher', 'admin')
  @ApiOperation({
    summary: 'Delete a quiz',
    description: 'Delete a quiz. Available to teachers and admins only.',
  })
  @ApiParam({ name: 'quizId', description: 'Quiz id' })
  @ApiResponse({
    status: 200,
    description: 'Quiz has been successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  async removeQuiz(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Req() req: RequestWithUser,
  ) {
    // First get the quiz to find its structureId
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { dataStructureId: true },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    return this.quizService.remove(
      quiz.dataStructureId,
      quizId,
      req.user.id,
      req.user.role,
    );
  }

  @Get('quizzes/:quizId/results')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get quiz results',
    description: 'Get quiz results. Available to all authenticated users.',
  })
  @ApiParam({ name: 'quizId', description: 'Quiz id' })
  @ApiResponse({
    status: 200,
    description: 'Return quiz results.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  async getQuizResults(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Req() req: RequestWithUser,
  ) {
    // First get the quiz to find its structureId
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { dataStructureId: true },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    return this.quizService.getResults(
      quiz.dataStructureId,
      quizId,
      req.user.id,
      req.user.role,
    );
  }

  @Get('slug/:slug')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get a data structure by slug',
    description:
      'Get a specific data structure by its slug. Available to all authenticated users.',
  })
  @ApiParam({ name: 'slug', description: 'Data structure slug' })
  @ApiResponse({
    status: 200,
    description: 'Return the data structure.',
    type: DataStructureEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.dataStructuresService.findBySlug(slug);
  }

  @Get('slug/:slug/quizzes')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiTags('student', 'teacher', 'admin')
  @ApiOperation({
    summary: 'Get all quizzes for a data structure by slug',
    description:
      'Get all quizzes for a data structure by its slug. Available to all authenticated users.',
  })
  @ApiParam({ name: 'slug', description: 'Data structure slug' })
  @ApiResponse({
    status: 200,
    description: 'Return all quizzes for the data structure.',
    type: [Object],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Data structure not found.' })
  async findAllQuizzesBySlug(@Param('slug') slug: string) {
    const ds = await this.dataStructuresService.findBySlug(slug);
    return this.quizService.findAll(ds.id);
  }

  @Get('video/:id')
  async getVideo(@Param('id') id: string, @Res() res: Response) {
    try {
      console.log(`🎥 Requesting video with ID: ${id}`);
      const videoPath = await this.dataStructuresService.getVideoPath(id);
      console.log(`📁 Video path: ${videoPath}`);
      
      if (!videoPath) {
        console.log(`❌ Video not found for ID: ${id}`);
        return res.status(404).json({ error: 'Video not found' });
      }

      // Set appropriate headers for video streaming
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      
      console.log(`✅ Serving video file: ${videoPath}`);
      res.sendFile(videoPath, { root: process.cwd() });
    } catch (error) {
      console.error('❌ Error serving video:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
