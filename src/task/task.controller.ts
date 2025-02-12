import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tasks by userId' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findByUserId(@Query('userId') userId: number) {
    return this.taskService.findByUserId(userId);
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiBody({
    type: CreateTaskDto,
    description: 'Create a new task',
    required: true,
    examples: {
      task: {
        value: {
          title: 'Task 1',
          description: 'Description 1',
          userId: 1,
          status: 'Done',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiBody({
    type: UpdateTaskDto,
    description: 'Update a task',
    required: true,
    examples: {
      task: {
        value: {
          title: 'Task 1',
          description: 'Description 1',
          userId: 1,
          status: 'Done',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(@Body() body: UpdateTaskDto, @Param('id') id: number) {
    const task = await this.taskService.update(body, id);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async delete(@Param('id') id: number) {
    await this.taskService.delete(id);
    return {
      message: 'Task deleted successfully',
    };
  }
}
