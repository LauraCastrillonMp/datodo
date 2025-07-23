import {
  IsEnum,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuizDifficulty, QuizQuestionType } from '@prisma/client';

export class CreateQuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  optionText: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsInt()
  @Min(0)
  order: number;
}

export class CreateQuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsEnum(QuizQuestionType)
  @IsNotEmpty()
  questionType: QuizQuestionType;

  @IsString()
  @IsOptional()
  explanation?: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options: CreateQuestionOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(QuizDifficulty)
  @IsNotEmpty()
  difficulty: QuizDifficulty;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions: CreateQuizQuestionDto[];
} 