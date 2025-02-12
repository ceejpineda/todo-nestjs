import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/createTask.dto';
import { UpdateTaskDto } from '../dto/updateTask.dto';
import { TaskResponseDto } from '../dto/taskResponse.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  async findAll() {
    const tasks = await this.repository.find();
    return tasks.map((task) => plainToClass(TaskResponseDto, task));
  }

  async findById(id: number) {
    const task = await this.repository.findOne({ where: { id } });
    return plainToClass(TaskResponseDto, task);
  }

  async findByUserId(userId: number) {
    const tasks = await this.repository.find({ where: { userId } });
    return tasks.map((task) => plainToClass(TaskResponseDto, task));
  }

  async create(body: CreateTaskDto) {
    const task = await this.repository.save(body);
    return plainToClass(TaskResponseDto, task);
  }

  async update(body: UpdateTaskDto, id: number) {
    const task = await this.repository.findOne({ where: { id } });

    if (!task) {
      throw new Error('Task not found');
    }

    const updatedTask = await this.repository.save({
      ...task,
      ...body,
    });

    return plainToClass(TaskResponseDto, updatedTask);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
