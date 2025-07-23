import { UserRole } from '@prisma/client';

export class ProfileDto {
  id: number;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
} 