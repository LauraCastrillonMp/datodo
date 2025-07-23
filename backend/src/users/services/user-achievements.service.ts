import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserAchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserAchievements(userId: number) {
    console.log(`🔍 getUserAchievements called for user ${userId}`);
    
    const [achievements, userAchievements, quizAttempts] = await Promise.all([
      this.prisma.achievement.findMany(),
      this.prisma.userAchievement.findMany({
        where: { userId },
      }),
      this.prisma.userQuizAttempt.findMany({
        where: { userId },
        include: {
          quiz: {
            include: {
              dataStructure: true,
            },
          },
        },
      }),
    ]);

    console.log(`📊 Found ${achievements.length} achievements, ${userAchievements.length} user achievements, ${quizAttempts.length} quiz attempts`);

    const result = achievements.map((achievement) => {
      const userAchievement = userAchievements.find(
        (ua) => ua.achievementId === achievement.id,
      );

      let progress = 0;
      let isCompleted = false;

      switch (achievement.name) {
        case 'Primer Cuestionario': {
          progress = Math.min(quizAttempts.length, 1);
          isCompleted = quizAttempts.length >= 1;
          break;
        }

        case 'Maestro de Cuestionarios': {
          progress = Math.min(quizAttempts.length, 10);
          isCompleted = quizAttempts.length >= 10;
          break;
        }

        case 'Iniciador de Racha': {
          const { currentStreak } = this.calculateStreaks(quizAttempts);
          progress = Math.min(currentStreak, 3);
          isCompleted = currentStreak >= 3;
          break;
        }

        case 'Estudiante Consistente': {
          const { longestStreak } = this.calculateStreaks(quizAttempts);
          progress = Math.min(longestStreak, 7);
          isCompleted = longestStreak >= 7;
          break;
        }

        case 'Explorador de Estructuras': {
          const uniqueStructures = new Set(
            quizAttempts.map((a) => a.quiz.dataStructure.id),
          ).size;
          progress = Math.min(uniqueStructures, 5);
          isCompleted = uniqueStructures >= 5;
          break;
        }

        case 'Puntuación Perfecta': {
          const hasPerfectScore = quizAttempts.some(
            (a) => Number(a.score) === 100,
          );
          progress = hasPerfectScore ? 1 : 0;
          isCompleted = hasPerfectScore;
          break;
        }

        case 'Velocista de Datos': {
          const fastQuiz = quizAttempts.some((attempt) => {
            const startTime = new Date(attempt.completedAt);
            const endTime = new Date(attempt.completedAt);
            const timeDiff = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // en minutos
            return timeDiff < 2;
          });
          progress = fastQuiz ? 1 : 0;
          isCompleted = fastQuiz;
          break;
        }

        case 'Estudiante Dedicado': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const quizzesToday = quizAttempts.filter((attempt) => {
            const attemptDate = new Date(attempt.completedAt);
            return attemptDate >= today && attemptDate < tomorrow;
          }).length;
          
          progress = Math.min(quizzesToday, 5);
          isCompleted = quizzesToday >= 5;
          break;
        }

        case 'Maestro de Pilas': {
          const stackQuizzes = quizAttempts.filter(
            (a) => a.quiz.dataStructure.slug === 'pilas' && Number(a.score) === 100,
          );
          progress = Math.min(stackQuizzes.length, 3);
          isCompleted = stackQuizzes.length >= 3;
          break;
        }

        case 'Experto en Colas': {
          const queueQuizzes = quizAttempts.filter(
            (a) => a.quiz.dataStructure.slug === 'colas' && Number(a.score) === 100,
          );
          progress = Math.min(queueQuizzes.length, 3);
          isCompleted = queueQuizzes.length >= 3;
          break;
        }
      }

      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        rarity: achievement.rarity,
        rewardXP: achievement.rewardXP,
        maxProgress: achievement.maxProgress,
        progress: userAchievement?.progress || progress,
        isCompleted: userAchievement?.isCompleted || isCompleted,
        completedAt: userAchievement?.completedAt,
      };
    });

    console.log(`✅ Returning ${result.length} achievements for user ${userId}`);
    return result;
  }

  async updateUserAchievements(userId: number) {
    const quizAttempts = await this.prisma.userQuizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            dataStructure: true,
          },
        },
      },
    });

    const achievements = await this.prisma.achievement.findMany();
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
    });

    for (const achievement of achievements) {
      let progress = 0;
      let isCompleted = false;

      switch (achievement.name) {
        case 'Primer Cuestionario': {
          progress = Math.min(quizAttempts.length, 1);
          isCompleted = quizAttempts.length >= 1;
          break;
        }

        case 'Maestro de Cuestionarios': {
          progress = Math.min(quizAttempts.length, 10);
          isCompleted = quizAttempts.length >= 10;
          break;
        }

        case 'Iniciador de Racha': {
          const { currentStreak } = this.calculateStreaks(quizAttempts);
          progress = Math.min(currentStreak, 3);
          isCompleted = currentStreak >= 3;
          break;
        }

        case 'Estudiante Consistente': {
          const { longestStreak } = this.calculateStreaks(quizAttempts);
          progress = Math.min(longestStreak, 7);
          isCompleted = longestStreak >= 7;
          break;
        }

        case 'Explorador de Estructuras': {
          const uniqueStructures = new Set(
            quizAttempts.map((a) => a.quiz.dataStructure.id),
          ).size;
          progress = Math.min(uniqueStructures, 5);
          isCompleted = uniqueStructures >= 5;
          break;
        }

        case 'Puntuación Perfecta': {
          const hasPerfectScore = quizAttempts.some(
            (a) => Number(a.score) === 100,
          );
          progress = hasPerfectScore ? 1 : 0;
          isCompleted = hasPerfectScore;
          break;
        }

        case 'Velocista de Datos': {
          const fastQuiz = quizAttempts.some((attempt) => {
            const startTime = new Date(attempt.completedAt);
            const endTime = new Date(attempt.completedAt);
            const timeDiff = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // en minutos
            return timeDiff < 2;
          });
          progress = fastQuiz ? 1 : 0;
          isCompleted = fastQuiz;
          break;
        }

        case 'Estudiante Dedicado': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const quizzesToday = quizAttempts.filter((attempt) => {
            const attemptDate = new Date(attempt.completedAt);
            return attemptDate >= today && attemptDate < tomorrow;
          }).length;
          
          progress = Math.min(quizzesToday, 5);
          isCompleted = quizzesToday >= 5;
          break;
        }

        case 'Maestro de Pilas': {
          const stackQuizzes = quizAttempts.filter(
            (a) => a.quiz.dataStructure.slug === 'pilas' && Number(a.score) === 100,
          );
          progress = Math.min(stackQuizzes.length, 3);
          isCompleted = stackQuizzes.length >= 3;
          break;
        }

        case 'Experto en Colas': {
          const queueQuizzes = quizAttempts.filter(
            (a) => a.quiz.dataStructure.slug === 'colas' && Number(a.score) === 100,
          );
          progress = Math.min(queueQuizzes.length, 3);
          isCompleted = queueQuizzes.length >= 3;
          break;
        }
      }

      const existingUserAchievement = userAchievements.find(
        (ua) => ua.achievementId === achievement.id,
      );

      // Use upsert to handle both create and update cases atomically
      await this.prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        update: {
          progress,
          isCompleted,
          completedAt:
            isCompleted && !existingUserAchievement?.completedAt
              ? new Date()
              : existingUserAchievement?.completedAt,
        },
        create: {
          userId,
          achievementId: achievement.id,
          progress,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });
    }
  }

  private calculateStreaks(quizAttempts: any[]) {
    if (quizAttempts.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const sortedAttempts = quizAttempts
      .map(attempt => new Date(attempt.completedAt))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const attemptDate of sortedAttempts) {
      if (!lastDate) {
        tempStreak = 1;
        lastDate = attemptDate;
        continue;
      }

      const daysDiff = Math.floor(
        (lastDate.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }

      lastDate = attemptDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    currentStreak = tempStreak;

    return { currentStreak, longestStreak };
  }
} 