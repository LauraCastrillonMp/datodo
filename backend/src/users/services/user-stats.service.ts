import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserStats(userId: number) {
    const quizAttempts = await this.prisma.userQuizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          include: {
            dataStructure: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalQuizzes = quizAttempts.length;
    const completedQuizzes = quizAttempts.filter(attempt => Number(attempt.score) > 0).length;
    const averageScore = totalQuizzes > 0 
      ? quizAttempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / totalQuizzes 
      : 0;

    const totalXP = quizAttempts.reduce((sum, attempt) => {
      const baseXP = 10;
      const scoreBonus = Math.floor(Number(attempt.score) / 10);
      return sum + baseXP + scoreBonus;
    }, 0);

    const level = Math.floor(totalXP / 1000) + 1;
    const { currentStreak, longestStreak } = this.calculateStreaks(quizAttempts);
    const totalStudyTime = totalQuizzes * 5; // 5 minutos por quiz como estimación
    const dataStructuresMastered = new Set(
      quizAttempts.map(attempt => attempt.quiz.dataStructure.id)
    ).size;

    const achievementsUnlocked = await this.getUserAchievementsCount(userId);

    return {
      totalXP,
      level,
      quizzesCompleted: completedQuizzes,
      averageScore: Math.round(averageScore * 100) / 100,
      streakDays: currentStreak,
      achievementsUnlocked,
      totalTimeSpent: totalStudyTime,
      dataStructuresMastered,
    };
  }

  async getWeeklyProgress(userId: number) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Primero intentar obtener registros de progreso existentes
    const progressRecords = await this.prisma.userProgressRecord.findMany({
      where: {
        userId,
        date: {
          gte: oneWeekAgo,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Si hay registros de progreso, devolverlos procesados
    if (progressRecords.length > 0) {
      return progressRecords.map(record => ({
        date: record.date,
        quizzes: record.quizzes,
        score: Number(record.score),
        studyTime: record.studyTime,
        xp: record.xp,
      }));
    }

    // Si no hay registros, generar datos basados en intentos de cuestionarios
    const quizAttempts = await this.prisma.userQuizAttempt.findMany({
      where: {
        userId,
        completedAt: {
          gte: oneWeekAgo,
        },
      },
      include: {
        quiz: {
          include: {
            dataStructure: true,
          },
        },
      },
      orderBy: {
        completedAt: 'asc',
      },
    });

    // Generar datos semanales basados en intentos
    const weeklyData = this.generateWeeklyDataFromAttempts(quizAttempts, oneWeekAgo);
    
    return weeklyData;
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

  private calculateImprovementRate(quizAttempts: any[]) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const lastWeekAttempts = quizAttempts.filter(
      attempt => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate >= twoWeeksAgo && attemptDate < oneWeekAgo;
      }
    );
    
    const thisWeekAttempts = quizAttempts.filter(
      attempt => new Date(attempt.completedAt) >= oneWeekAgo
    );

    const lastWeekAvg = lastWeekAttempts.length > 0 
      ? lastWeekAttempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / lastWeekAttempts.length 
      : 0;
    
    const thisWeekAvg = thisWeekAttempts.length > 0 
      ? thisWeekAttempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / thisWeekAttempts.length 
      : 0;

    return lastWeekAvg > 0 ? ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 : 0;
  }

  private async getUserAchievementsCount(userId: number): Promise<number> {
    return this.prisma.userAchievement.count({
      where: {
        userId,
        isCompleted: true,
      },
    });
  }

  private generateWeeklyDataFromAttempts(attempts: any[], oneWeekAgo: Date) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const weeklyData = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(oneWeekAgo);
      currentDate.setDate(oneWeekAgo.getDate() + i);
      
      // Filtrar intentos para este día específico
      const dayAttempts = attempts.filter(attempt => {
        const attemptDate = new Date(attempt.completedAt);
        return attemptDate.toDateString() === currentDate.toDateString();
      });

      // Calcular métricas para este día
      const quizzes = dayAttempts.length;
      const score = dayAttempts.length > 0 
        ? dayAttempts.reduce((sum, attempt) => sum + Number(attempt.score), 0) / dayAttempts.length 
        : 0;
      const studyTime = dayAttempts.length * 5; // 5 minutos por cuestionario
      const xp = dayAttempts.reduce((sum, attempt) => {
        const baseXP = 10;
        const scoreBonus = Math.floor(Number(attempt.score) / 10);
        return sum + baseXP + scoreBonus;
      }, 0);

      weeklyData.push({
        date: currentDate,
        quizzes,
        score: Math.round(score * 100) / 100,
        studyTime,
        xp,
      });
    }

    return weeklyData;
  }
} 