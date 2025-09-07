import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizAttemptDto } from './dto/quiz-attempt.dto';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { QuizEntity } from './entities/quiz.entity';

interface RequestWithUser {
  user: {
    id: number;
    role: UserRole;
  };
}

@ApiTags('quizzes')
@ApiBearerAuth()
@Controller('data-structures/:structureId/quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({
    summary: 'Create a new quiz',
    description: 'Create a new quiz. Available to teachers and admins only.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiResponse({
    status: 201,
    description: 'The quiz has been successfully created.',
    type: QuizEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Data structure not found.',
  })
  create(
    @Param('structureId') structureId: string,
    @Body() createQuizDto: CreateQuizDto,
    @NestRequest() req: RequestWithUser,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request. Are you authenticated?');
    }
    return this.quizService.create(+structureId, createQuizDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Get all quizzes for a data structure',
    description: 'Get all quizzes. Available to all authenticated users.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all quizzes.',
    type: [QuizEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Data structure not found.',
  })
  findAll(@Param('structureId') structureId: string) {
    return this.quizService.findAll(+structureId);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Get a quiz by id',
    description: 'Get a specific quiz. Available to all authenticated users.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the quiz',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the quiz.',
    type: QuizEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  findOne(@Param('structureId') structureId: string, @Param('id') id: string) {
    return this.quizService.findOne(+structureId, +id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({
    summary: 'Update a quiz',
    description: 'Update a quiz. Available to teachers and admins only.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the quiz',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The quiz has been successfully updated.',
    type: QuizEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have permission to update this quiz.',
  })
  update(
    @Param('structureId') structureId: string,
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @NestRequest() req: RequestWithUser,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request. Are you authenticated?');
    }
    return this.quizService.update(
      +structureId,
      +id,
      updateQuizDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({
    summary: 'Delete a quiz',
    description: 'Delete a quiz. Available to teachers and admins only.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the quiz',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'The quiz has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have permission to delete this quiz.',
  })
  remove(
    @Param('structureId') structureId: string,
    @Param('id') id: string,
    @NestRequest() req: RequestWithUser,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request. Are you authenticated?');
    }
    return this.quizService.remove(
      +structureId,
      +id,
      req.user.id,
      req.user.role,
    );
  }

  @Post(':id/attempt')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Submit a quiz attempt',
    description: 'Submit a quiz attempt. Available to all authenticated users.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the quiz',
    type: 'number',
  })
  @ApiResponse({
    status: 201,
    description: 'The quiz attempt has been successfully submitted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid attempt data.',
  })
  async submitAttempt(
    @Param('structureId') structureId: string,
    @Param('id') id: string,
    @Body() attemptDto: QuizAttemptDto,
    @NestRequest() req: RequestWithUser,
  ) {
    if (!req.user || !req.user.id) {
      throw new Error('User not found in request. Are you authenticated?');
    }

    // Validate attempt data
    if (!attemptDto.answers || attemptDto.answers.length === 0) {
      throw new Error('No answers provided for quiz attempt.');
    }

    console.log('submitAttempt req.user:', req.user);

    const attempt = await this.quizService.submitAttempt(
      +structureId,
      +id,
      attemptDto,
      req.user.id,
    );

    return {
      success: true,
      message: 'Quiz attempt submitted successfully',
      data: {
        attemptId: attempt.id,
        score: attempt.score,
        completedAt: attempt.completedAt,
      },
    };
  }

  @Get(':id/results')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Get quiz results',
    description: 'Get quiz results. Available to all authenticated users.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the quiz',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Return quiz results.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  getResults(
    @Param('structureId') structureId: string,
    @Param('id') id: string,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.quizService.getResults(
      +structureId,
      +id,
      req.user.id,
      req.user.role,
    );
  }

  @Get(':id/analytics')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({
    summary: 'Get quiz analytics',
    description: 'Get quiz analytics. Available to teachers and admins only.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the quiz',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Return quiz analytics.',
  })
  @ApiResponse({
    status: 404,
    description: 'Quiz not found.',
  })
  getAnalytics(
    @Param('structureId') structureId: string,
    @Param('id') id: string,
  ) {
    return this.quizService.getAnalytics(+structureId, +id);
  }

  @Get(':userId/unlocked-quizzes')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Get unlocked quizzes',
    description: 'Get unlocked quizzes. Available to all authenticated users.',
  })
  @ApiParam({
    name: 'structureId',
    description: 'ID of the data structure',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Return unlocked quizzes.',
  })
  getUnlockedQuizzes(
    @Param('structureId') structureId: string,
    @NestRequest() req: RequestWithUser,
  ) {
    console.log(`🔓 API called - Structure: ${structureId}, User: ${req.user.id}`);
    return this.quizService.unlockedQuizzes(+structureId, +req.user.id);
  }

  @Get('test-unlock/:structureId')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Test unlock - returns all quizzes',
    description: 'Test endpoint that returns all quizzes for debugging.',
  })
  async testUnlock(@Param('structureId') structureId: string) {
    console.log(`🧪 Test unlock called for structure ${structureId}`);
    return this.quizService.findAll(+structureId);
  }

  @Get('debug-attempts')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.student)
  @ApiOperation({
    summary: 'Debug all quiz attempts',
    description: 'Debug endpoint to see all quiz attempts in the database.',
  })
  async debugAttempts() {
    return this.quizService.debugAllAttempts();
  }
}
