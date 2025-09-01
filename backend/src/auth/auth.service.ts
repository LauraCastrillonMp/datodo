import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { TokenBlacklistService } from './token-blacklist.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    public readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthResponse | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    console.log('🔍 Checking login for:', email);
    console.log('User from DB:', user);
    if (!user || !user.password) {
      console.warn('❌ No user or no password');
      return null;
    }

    const match = await bcrypt.compare(password, user.password);
    console.log('🧪 Bcrypt result:', match);

    if (!match) {
      console.warn('❌ Password mismatch');
      return null;
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getTokens(
    userId: number,
    username: string,
    role: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: process.env.JWT_SECRET || 'your-secret-key',
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(user: AuthResponse) {
    const tokens = await this.getTokens(user.id, user.username, user.role);
    return {
      ...user,
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, username } = registerDto;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.usersService.create({
      email: normalizedEmail,
      password: password,
      name,
      username,
      role: 'student', // Default role
    });

    const { password: _, ...result } = user;
    return result;
  }

  async logout(userId: number): Promise<void> {
    console.log(`User ${userId} logged out`);
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });

      // Check if user still exists
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new ForbiddenException('Access Denied');
      }

      // Check if the token is blacklisted
      const isBlacklisted =
        await this.tokenBlacklistService.isBlacklisted(refreshToken);
      if (isBlacklisted) {
        throw new ForbiddenException('Access Denied');
      }

      // Generate new tokens
      const tokens = await this.getTokens(user.id, user.username, user.role);

      // Optionally blacklist the old refresh token
      await this.tokenBlacklistService.addToBlacklist(refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Access Denied');
    }
  }
}
