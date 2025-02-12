import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TaskResponseDto {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the task',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Write comprehensive documentation for the NestJS project',
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: 'Current status of the task',
    example: 'pending',
    enum: ['pending', 'in_progress', 'completed'],
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: 'ID of the user who owns this task',
    example: 1,
  })
  userId: number;

  constructor(partial: Partial<TaskResponseDto>) {
    Object.assign(this, partial);
  }
}
