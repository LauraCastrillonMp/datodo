import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: UserEntity,
  })
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List of all users.', type: [UserEntity] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Details of a specific user.',
    type: UserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: UserEntity,
  })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
    type: UserEntity,
  })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get the current authenticated user.',
    type: UserEntity,
  })
  getMe(@Request() req: { user: UserEntity }) {
    return this.service.findOne(req.user.id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get user statistics and progress.' })
  getUserStats(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserStats(id);
  }

  @Get(':id/achievements')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get user achievements and progress.' })
  async getUserAchievements(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log(`🔍 Getting achievements for user ${id}`);
      const achievements = await this.service.getUserAchievements(id);
      console.log(`✅ Achievements retrieved for user ${id}:`, achievements);
      return achievements;
    } catch (error) {
      console.error(`❌ Error getting achievements for user ${id}:`, error);
      throw error;
    }
  }

  @Post(':id/achievements/update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update user achievements based on current progress.',
  })
  async updateUserAchievements(@Param('id', ParseIntPipe) id: number) {
    try {
      console.log(`🔄 Updating achievements for user ${id}`);
      const result = await this.service.updateUserAchievements(id);
      console.log(`✅ Achievements updated for user ${id}:`, result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating achievements for user ${id}:`, error);
      throw error;
    }
  }

  @Get(':id/progress/weekly')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Get user weekly progress and activity.' })
  getWeeklyProgress(@Param('id', ParseIntPipe) id: number) {
    return this.service.getWeeklyProgress(id);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Change the role of a user.',
    type: UserEntity,
  })
  changeRole(
    @Request() req: { user: { role: 'admin' | 'teacher' | 'student' } },
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateRoleDto: { role: 'admin' | 'teacher' | 'student' },
  ) {
    return this.service.changeRole(req.user, userId, updateRoleDto.role);
  }
}
