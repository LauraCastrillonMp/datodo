import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UserRole, Quiz, QuizQuestion, QuestionOption } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async create(
    dataStructureId: number,
    createQuizDto: CreateQuizDto,
    userId: number,
  ): Promise<Quiz & {
    questions: (QuizQuestion & {
      options: QuestionOption[];
    })[];
  }> {
    // Verify data structure exists
    const dataStructure = await this.prisma.dataStructure.findUnique({
      where: { id: dataStructureId },
    });

    if (!dataStructure) {
      throw new NotFoundException(
        `Data structure with ID ${dataStructureId} not found`,
      );
    }

    // Create quiz with questions and options
    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        description: createQuizDto.description,
        difficulty: createQuizDto.difficulty,
        dataStructureId,
        createdBy: userId,
        questions: {
          create: createQuizDto.questions.map((question, index) => ({
            questionText: question.questionText,
            questionType: question.questionType,
            explanation: question.explanation,
            order: question.order,
            options: {
              create: question.options.map((option, optionIndex) => ({
                optionText: option.optionText,
                isCorrect: option.isCorrect,
                order: option.order,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findAll(dataStructureId: number): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { dataStructureId },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<Quiz & {
    questions: (QuizQuestion & {
      options: QuestionOption[];
    })[];
  }> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async submitQuiz(
    quizId: number,
    userId: number,
    answers: { questionId: number; selectedOptionIds: number[] }[],
  ): Promise<{ score: number; totalQuestions: number }> {
    const quiz = await this.findOne(quizId);

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) {
        throw new BadRequestException(
          `Question with ID ${answer.questionId} not found in quiz`,
        );
      }

      const correctOptions = question.options.filter(opt => opt.isCorrect);
      const selectedOptions = question.options.filter(opt =>
        answer.selectedOptionIds.includes(opt.id),
      );

      // Check if all correct options are selected and no incorrect options are selected
      if (
        correctOptions.length === selectedOptions.length &&
        selectedOptions.every(opt => opt.isCorrect)
      ) {
        correctAnswers++;
      }
    }

    const score = (correctAnswers / totalQuestions) * 100;

    // Record attempt
    await this.prisma.userQuizAttempt.create({
      data: {
        userId,
        quizId,
        score,
      },
    });

    return { score, totalQuestions };
  }

  async remove(id: number, userId: number, userRole: UserRole): Promise<void> {
    const quiz = await this.findOne(id);

    if (userRole !== UserRole.admin && quiz.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this quiz',
      );
    }

    await this.prisma.quiz.delete({
      where: { id },
    });
  }
} 