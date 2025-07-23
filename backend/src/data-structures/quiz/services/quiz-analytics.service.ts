import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  Quiz,
  QuizQuestion,
  QuestionOption,
  UserQuizAttempt,
  UserRole,
} from '@prisma/client';
import { QuizAttemptDto } from '../dto/quiz-attempt.dto';

@Injectable()
export class QuizAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(
    structureId: number,
    id: number,
  ): Promise<{
    averageScore: number;
    totalAttempts: number;
    passRate: number;
  }> {
    const attempts = await this.prisma.userQuizAttempt.findMany({
      where: {
        quizId: id,
        quiz: {
          dataStructureId: structureId,
        },
      },
    });

    if (attempts.length === 0) {
      return {
        averageScore: 0,
        totalAttempts: 0,
        passRate: 0,
      };
    }

    const totalAttempts = attempts.length;
    const averageScore =
      attempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) /
      totalAttempts;
    const passRate =
      (attempts.filter(attempt => Number(attempt.score) >= 70).length /
        totalAttempts) *
      100;

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      totalAttempts,
      passRate: Math.round(passRate * 100) / 100,
    };
  }

  async getResults(
    structureId: number,
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<UserQuizAttempt[]> {
    const whereClause: any = {
      quizId: id,
      quiz: {
        dataStructureId: structureId,
      },
    };

    // Students can only see their own attempts
    if (userRole === 'student') {
      whereClause.userId = userId;
    }

    return this.prisma.userQuizAttempt.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        quiz: {
          select: {
            title: true,
            dataStructure: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }

  async calculateScore(
    quiz: Quiz & {
      questions: (QuizQuestion & {
        options: QuestionOption[];
      })[];
    },
    attemptDto: QuizAttemptDto,
  ): Promise<number> {
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const userAnswer = attemptDto.answers.find(
        answer => answer.questionId === question.id,
      );

      if (!userAnswer) continue;

      const correctOptions = question.options.filter(option => option.isCorrect);
      const userSelectedOptions = question.options.filter(option =>
        userAnswer.selectedOptionIds.includes(option.id),
      );

      // Check if user selected exactly the correct options
      if (
        userSelectedOptions.length === correctOptions.length &&
        userSelectedOptions.every(option => option.isCorrect)
      ) {
        correctAnswers++;
      }
    }

    return Math.round((correctAnswers / totalQuestions) * 100);
  }
} 