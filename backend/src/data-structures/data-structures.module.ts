import { Module } from '@nestjs/common';
import { DataStructuresController } from './data-structures.controller';
import { DataStructuresService } from './data-structures.service';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizModule } from './quiz/quiz.module';
import { ContentController } from './content/content.controller';
import { ContentService } from './content/content.service';

@Module({
  imports: [PrismaModule, QuizModule],
  controllers: [DataStructuresController, ContentController],
  providers: [DataStructuresService, ContentService],
  exports: [DataStructuresService],
})
export class DataStructuresModule {}
