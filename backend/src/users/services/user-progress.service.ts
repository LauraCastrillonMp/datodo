import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async trackQuizCompletion(userId: number, quizId: number, score: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate XP for this quiz
    const baseXP = 10;
    const scoreBonus = Math.floor(score / 10); // 1 XP per 10% score
    const xpEarned = baseXP + scoreBonus;

    // Estimate study time (5 minutes per quiz)
    const studyTime = 5;

    // Use raw SQL to handle the upsert with proper conflict resolution
    await this.prisma.$executeRaw`
      INSERT INTO user_progress_records (userId, date, quizzes, score, studyTime, xp, createdAt, updatedAt)
      VALUES (${userId}, ${today}, 1, ${score}, ${studyTime}, ${xpEarned}, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        quizzes = quizzes + 1,
        score = score + ${score},
        studyTime = studyTime + ${studyTime},
        xp = xp + ${xpEarned},
        updatedAt = NOW()
    `;
  }
} 