import { ApiProperty } from '@nestjs/swagger';
import { QuizDifficulty, QuizQuestionType } from '@prisma/client';

export class QuizOption {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Option A' })
  optionText: string;

  @ApiProperty({ example: true })
  isCorrect: boolean;

  @ApiProperty({ example: 1 })
  questionId: number;

  @ApiProperty({ example: 1 })
  order: number;
}

export class QuizQuestion {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'What is the time complexity of binary search?' })
  questionText: string;

  @ApiProperty({
    enum: QuizQuestionType,
    example: QuizQuestionType.multiple_choice,
  })
  questionType: QuizQuestionType;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 1 })
  quizId: number;

  @ApiProperty({ type: [QuizOption] })
  options: QuizOption[];
}

export class QuizEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Binary Search Quiz' })
  title: string;

  @ApiProperty({ example: 'Test your knowledge of binary search algorithm' })
  description: string;

  @ApiProperty({
    enum: QuizDifficulty,
    example: QuizDifficulty.principiante,
  })
  difficulty: QuizDifficulty;

  @ApiProperty({ example: 1 })
  dataStructureId: number;

  @ApiProperty({ example: 1 })
  createdBy: number;

  @ApiProperty({ type: [QuizQuestion] })
  questions: QuizQuestion[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
