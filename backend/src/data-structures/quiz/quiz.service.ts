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

    console.log(`🎯 Quiz submission - User: ${userId}, Quiz: ${id}, Score: ${score}, Difficulty: ${quiz.difficulty}`);

    const attempt = await this.prisma.userQuizAttempt.create({
      data: {
        userId,
        quizId: id,
        score,
      },
    });

    console.log(`🎯 Quiz attempt created with ID: ${attempt.id}, Score: ${attempt.score.toNumber()}`);

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
    console.log(`🔓 Checking unlocked quizzes for user ${userId} in structure ${structureId}`);
    
    try {
      // First, let's check if the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });
      console.log(`🔓 User exists:`, !!user, user ? { id: user.id, username: user.username } : 'NOT FOUND');

      // Get all quizzes for this structure
      const allQuizzes = await this.prisma.quiz.findMany({
        where: { dataStructureId: structureId },
        include: { questions: true },
      });

      console.log(`🔓 Found ${allQuizzes.length} total quizzes in structure ${structureId}`);

      // Get quiz attempts for this user in THIS specific structure only
      const structureAttempts = await this.prisma.userQuizAttempt.findMany({
        where: { 
          userId,
          quiz: {
            dataStructureId: structureId
          }
        },
        include: { 
          quiz: { 
            include: { 
              dataStructure: true 
            } 
          } 
        },
        orderBy: { completedAt: 'desc' }
      });

      console.log(`🔓 Found ${structureAttempts.length} attempts for user ${userId} in structure ${structureId}`);
      
      // Log attempts for this specific structure
      if (structureAttempts.length > 0) {
        console.log(`🔓 User's attempts in structure ${structureId}:`);
        structureAttempts.forEach(attempt => {
          console.log(`  - Quiz ${attempt.quizId} (${attempt.quiz.title}) - Score: ${attempt.score.toNumber()}% - Difficulty: ${attempt.quiz.difficulty} - Date: ${attempt.completedAt}`);
        });
      } else {
        console.log(`🔓 No quiz attempts found for user ${userId} in structure ${structureId}`);
      }

      // Group quizzes by difficulty for this structure
      const quizzesByDifficulty: Record<QuizDifficulty, typeof allQuizzes> = {
        principiante: [],
        intermedio: [],
        avanzado: [],
      };

      for (const quiz of allQuizzes) {
        quizzesByDifficulty[quiz.difficulty].push(quiz);
      }

      console.log(`🔓 Quizzes by difficulty in structure ${structureId}:`, {
        principiante: quizzesByDifficulty.principiante.map(q => ({ id: q.id, title: q.title })),
        intermedio: quizzesByDifficulty.intermedio.map(q => ({ id: q.id, title: q.title })),
        avanzado: quizzesByDifficulty.avanzado.map(q => ({ id: q.id, title: q.title }))
      });

      // Check if user has passed quizzes in this specific structure
      const passedQuizIds = new Set(
        structureAttempts
          .filter(a => a.score.toNumber() >= 60)
          .map(a => a.quizId)
      );

      console.log(`🔓 Passed quiz IDs in structure ${structureId}:`, Array.from(passedQuizIds));

      // Check if user has passed at least one quiz of each difficulty level in THIS structure
      const hasPassedPrincipiante = quizzesByDifficulty.principiante.some(q => passedQuizIds.has(q.id));
      const hasPassedIntermedio = quizzesByDifficulty.intermedio.some(q => passedQuizIds.has(q.id));
      const hasPassedAvanzado = quizzesByDifficulty.avanzado.some(q => passedQuizIds.has(q.id));

      console.log(`🔓 Passed levels in structure ${structureId}:`, { 
        hasPassedPrincipiante, 
        hasPassedIntermedio, 
        hasPassedAvanzado 
      });

      const unlockedDifficulties = new Set<QuizDifficulty>();

      // Always unlock "principiante"
      unlockedDifficulties.add('principiante');

      // Unlock "intermedio" if user has passed at least one "principiante" quiz in THIS structure
      if (hasPassedPrincipiante) {
        unlockedDifficulties.add('intermedio');
      }

      // Unlock "avanzado" if user has passed at least one "intermedio" quiz in THIS structure
      if (hasPassedIntermedio) {
        unlockedDifficulties.add('avanzado');
      }

      console.log(`🔓 Unlocked difficulties in structure ${structureId}:`, Array.from(unlockedDifficulties));

      const unlockedQuizzes = allQuizzes.filter(q => unlockedDifficulties.has(q.difficulty));
      console.log(`🔓 Returning ${unlockedQuizzes.length} unlocked quizzes for structure ${structureId}:`, unlockedQuizzes.map(q => ({ id: q.id, title: q.title, difficulty: q.difficulty })));

      return unlockedQuizzes;
      
    } catch (error) {
      console.error(`❌ Error in unlockedQuizzes:`, error);
      // Return only beginner level quizzes as fallback
      const allQuizzes = await this.prisma.quiz.findMany({
        where: { dataStructureId: structureId },
        include: { questions: true },
      });
      const beginnerQuizzes = allQuizzes.filter(q => q.difficulty === 'principiante');
      console.log(`🔓 Error fallback: returning only ${beginnerQuizzes.length} beginner quizzes`);
      return beginnerQuizzes;
    }
  }

  async debugAllAttempts() {
    console.log(`🔍 Debug: Getting all quiz attempts from database`);
    
    const attempts = await this.prisma.userQuizAttempt.findMany({
      include: { 
        quiz: { 
          include: { 
            dataStructure: true 
          } 
        } 
      },
      orderBy: { completedAt: 'desc' }
    });

    const result = {
      totalAttempts: attempts.length,
      attempts: attempts.map(a => ({
        id: a.id,
        userId: a.userId,
        quizId: a.quizId,
        quizTitle: a.quiz.title,
        dataStructureId: a.quiz.dataStructureId,
        dataStructureTitle: a.quiz.dataStructure.title,
        difficulty: a.quiz.difficulty,
        score: a.score.toNumber(),
        completedAt: a.completedAt
      })),
      uniqueUsers: [...new Set(attempts.map(a => a.userId))],
      uniqueStructures: [...new Set(attempts.map(a => a.quiz.dataStructureId))]
    };

    console.log(`🔍 Debug result:`, result);
    return result;
  }

}
