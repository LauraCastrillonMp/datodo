import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserStatsService } from './services/user-stats.service';
import { UserAchievementsService } from './services/user-achievements.service';
import { UserProgressService } from './services/user-progress.service';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userStatsService: UserStatsService,
    private readonly userAchievementsService: UserAchievementsService,
    private readonly userProgressService: UserProgressService,
  ) {}

  // Basic CRUD operations
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  // User management operations
  async changeRole(
    requestingUser: { role: UserRole },
    userId: number,
    newRole: UserRole,
  ): Promise<User> {
    if (requestingUser.role !== UserRole.admin) {
      throw new ForbiddenException(
        'You do not have permission to change user roles',
      );
    }

    const userToUpdate = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToUpdate) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Delegate to specialized services
  async getUserStats(userId: number) {
    return this.userStatsService.getUserStats(userId);
  }

  async getUserAchievements(userId: number) {
    return this.userAchievementsService.getUserAchievements(userId);
  }

  async updateUserAchievements(userId: number) {
    return this.userAchievementsService.updateUserAchievements(userId);
  }

  async getWeeklyProgress(userId: number) {
    return this.userStatsService.getWeeklyProgress(userId);
  }

  async trackQuizCompletion(userId: number, quizId: number, score: number) {
    await this.userProgressService.trackQuizCompletion(userId, quizId, score);
    await this.userAchievementsService.updateUserAchievements(userId);
  }
}
