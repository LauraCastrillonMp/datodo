import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from '../../users/users.module';
import { QuizAnalyticsService } from './services/quiz-analytics.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [QuizController],
  providers: [QuizService, QuizAnalyticsService],
  exports: [QuizService],
})
export class QuizModule {} 