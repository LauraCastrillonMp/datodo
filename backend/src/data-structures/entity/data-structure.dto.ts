import { DataStructureDifficulty } from '@prisma/client';

export class DataStructureEntity {
  id: number;
  title: string;
  description: string;
  difficulty: DataStructureDifficulty;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}
