import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizAttemptDto } from './dto/quiz-attempt.dto';
import {
  UserRole,
  Prisma,
  Quiz,
  QuizQuestion,
  QuestionOption,
  UserQuizAttempt,
  QuizDifficulty,
} from '@prisma/client';
import { UsersService } from '../../users/users.service';
import { QuizAnalyticsService } from './services/quiz-analytics.service';

@Injectable()
export class QuizService {
  // findMany(arg0: {
  //   where: { difficulty: { in: $Enums.QuizDifficulty[] } };
  //   include: { questions: { include: { options: boolean } } };
  // }) {
  //   throw new Error('Method not implemented.');
  // }
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private quizAnalyticsService: QuizAnalyticsService,
  ) {}

  async create(
    structureId: number,
    createQuizDto: CreateQuizDto,
    userId: number,
  ): Promise<Quiz> {
    // Verify data structure exists
    const dataStructure = await this.prisma.dataStructure.findUnique({
      where: { id: structureId },
    });

    if (!dataStructure) {
      throw new NotFoundException(
        `Data structure with ID ${structureId} not found`,
      );
    }

    // Create quiz with nested questions and options
    const quizData: Prisma.QuizCreateInput = {
      title: createQuizDto.title,
      description: createQuizDto.description,
      difficulty: createQuizDto.difficulty,
      dataStructure: {
        connect: { id: structureId },
      },
      creator: {
        connect: { id: userId },
      },
      questions: {
        create: createQuizDto.questions.map((q, index) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          order: index + 1,
          options: {
            create: q.options.map((o, optIndex) => ({
              optionText: o.optionText,
              isCorrect: o.isCorrect,
              order: optIndex + 1,
            })),
          },
        })),
      },
    };

    const quiz = await this.prisma.quiz.create({
      data: quizData,
    });

    // Create edit log
    await this.prisma.quizEditLog.create({
      data: {
        quizId: quiz.id,
        editedBy: userId,
        changesSummary: 'Quiz created',
      },
    });

    return quiz;
  }

  async findAll(structureId: number): Promise<Quiz[]> {
    console.log('🔍 QuizService.findAll called with structureId:', structureId);

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

    const quizzes = await this.prisma.quiz.findMany({
      where: { dataStructureId: structureId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    console.log('📊 Quizzes found:', quizzes.length);
    return quizzes;
  }

  async findOne(
    structureId: number,
    id: number,
  ): Promise<
    Quiz & {
      questions: (QuizQuestion & {
        options: QuestionOption[];
      })[];
    }
  > {
    const quiz = await this.prisma.quiz.findFirst({
      where: {
        id,
        dataStructureId: structureId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(
        `Quiz with ID ${id} not found in data structure ${structureId}`,
      );
    }

    return quiz;
  }

  async update(
    structureId: number,
    id: number,
    updateQuizDto: UpdateQuizDto,
    userId: number,
    userRole: UserRole,
  ): Promise<Quiz> {
    const quiz = await this.findOne(structureId, id);

    // Permitir a cualquier teacher o admin editar cualquier quiz
    if (userRole !== UserRole.admin && userRole !== UserRole.teacher) {
      throw new ForbiddenException(
        'You do not have permission to update this quiz',
      );
    }

    // Update quiz with nested questions and options
    const updateData: Prisma.QuizUpdateInput = {
      title: updateQuizDto.title,
      description: updateQuizDto.description,
      difficulty: updateQuizDto.difficulty,
      questions: {
        deleteMany: {},
        create:
          updateQuizDto.questions?.map((q, index) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            order: index + 1,
            options: {
              create: q.options.map((o, optIndex) => ({
                optionText: o.optionText,
                isCorrect: o.isCorrect,
                order: optIndex + 1,
              })),
            },
          })) || [],
      },
    };

    const updatedQuiz = await this.prisma.quiz.update({
      where: { id },
      data: updateData,
    });

    // Create edit log
    await this.prisma.quizEditLog.create({
      data: {
        quizId: id,
        editedBy: userId,
        changesSummary: 'Quiz updated',
      },
    });

    return updatedQuiz;
  }

  async remove(
    structureId: number,
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<void> {
    const quiz = await this.findOne(structureId, id);

    // Check if user has permission to delete
    if (userRole !== UserRole.admin && quiz.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this quiz',
      );
    }

    await this.prisma.quiz.delete({
      where: { id },
    });

    await this.prisma.quizEditLog.create({
      data: {
        quizId: id,
        editedBy: userId,
        changesSummary: 'Quiz deleted',
      },
    });
  }

  async submitAttempt(
    structureId: number,
    id: number,
    attemptDto: QuizAttemptDto,
    userId: number,
  ): Promise<UserQuizAttempt> {
    const quiz = await this.findOne(structureId, id);
    const score = await this.quizAnalyticsService.calculateScore(
      quiz,
      attemptDto,
    );

    const attempt = await this.prisma.userQuizAttempt.create({
      data: {
        userId,
        quizId: id,
        score,
      },
    });

    // Track quiz completion for user progress
    await this.usersService.trackQuizCompletion(userId, id, score);

    return attempt;
  }

  async getResults(
    structureId: number,
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<UserQuizAttempt[]> {
    return this.quizAnalyticsService.getResults(
      structureId,
      id,
      userId,
      userRole,
    );
  }

  async getAnalytics(
    structureId: number,
    id: number,
  ): Promise<{
    averageScore: number;
    totalAttempts: number;
    passRate: number;
  }> {
    return this.quizAnalyticsService.getAnalytics(structureId, id);
  }

  async unlockedQuizzes(structureId: number, userId: number): Promise<Quiz[]> {
    const allQuizzes = await this.prisma.quiz.findMany({
      where: { dataStructureId: structureId },
      include: { questions: true },
    });

    const attempts = await this.prisma.userQuizAttempt.findMany({
      where: {
        userId,
        quiz: {
          dataStructureId: structureId,
        },
      },
      include: {
        quiz: true,
      },
    });

    const passed = new Set(
      attempts
        .filter((a) => a.score.toNumber() >= 60) // use your real pass threshold
        .map((a) => a.quizId),
    );

    // Group quizzes by difficulty
    const quizzesByDifficulty: Record<QuizDifficulty, typeof allQuizzes> = {
      principiante: [],
      intermedio: [],
      avanzado: [],
    };

    for (const quiz of allQuizzes) {
      quizzesByDifficulty[quiz.difficulty].push(quiz);
    }

    const allPassed = (quizzes: typeof allQuizzes) =>
      quizzes.every((q) => passed.has(q.id));

    const unlockedDifficulties = new Set<QuizDifficulty>();

    // Always unlock "principiante"
    unlockedDifficulties.add('principiante');

    if (allPassed(quizzesByDifficulty.principiante)) {
      unlockedDifficulties.add('intermedio');
    }

    if (
      allPassed(quizzesByDifficulty.principiante) &&
      allPassed(quizzesByDifficulty.intermedio)
    ) {
      unlockedDifficulties.add('avanzado');
    }

    // Return only quizzes in unlocked levels
    return allQuizzes.filter((q) => unlockedDifficulties.has(q.difficulty));
  }
}
