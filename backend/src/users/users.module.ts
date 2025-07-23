import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserStatsService } from './services/user-stats.service';
import { UserAchievementsService } from './services/user-achievements.service';
import { UserProgressService } from './services/user-progress.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserStatsService,
    UserAchievementsService,
    UserProgressService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
