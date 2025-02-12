import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(4)
  title: string;

  @IsString()
  @MinLength(6)
  description: string;

  @IsString()
  @MinLength(4)
  status: string;

  @IsNumber()
  userId: number;
}
