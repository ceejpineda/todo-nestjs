import { Optional } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @MinLength(4)
  @Optional()
  title: string;

  @IsString()
  @MinLength(6)
  @Optional()
  description: string;

  @IsString()
  @MinLength(4)
  @Optional()
  status: string;
}
