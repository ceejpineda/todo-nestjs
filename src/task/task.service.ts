import { HttpException, Injectable } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll() {
    return this.taskRepository.findAll();
  }

  async findByUserId(userId: number) {
    try {
      if (!userId) {
        throw new HttpException('User ID is required', 400);
      }

      return this.taskRepository.findByUserId(userId);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async create(body: CreateTaskDto) {
    try {
      const task = await this.taskRepository.create(body);
      return task;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async update(body: UpdateTaskDto, id: number) {
    try {
      const existingTask = await this.taskRepository.findById(id);

      if (!existingTask) {
        throw new HttpException('Task not found', 404);
      }

      const task = await this.taskRepository.update(body, id);
      return task;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async delete(id: number) {
    try {
      const existingTask = await this.taskRepository.findById(id);

      if (!existingTask) {
        throw new HttpException('Task not found', 404);
      }

      await this.taskRepository.delete(id);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
