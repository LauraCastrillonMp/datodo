import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QuizAnswerDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  questionId: number;

  @ApiProperty({ example: [1, 2], description: 'Array of selected option IDs' })
  @IsArray()
  @IsNumber({}, { each: true })
  selectedOptionIds: number[];
}

export class QuizAttemptDto {
  @ApiProperty({ type: [QuizAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers: QuizAnswerDto[];
} 