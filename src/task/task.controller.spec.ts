import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { JwtGuard } from '../guards/jwt.guard';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return tasks for user', async () => {
      const mockTasks = [{ id: 1, title: 'Test Task' }];
      mockTaskService.findByUserId.mockResolvedValue(mockTasks);

      const result = await controller.findByUserId(1);
      expect(result).toEqual(mockTasks);
      expect(service.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        status: 'pending',
        userId: 1,
      };
      const mockTask = { id: 1, ...createTaskDto };
      mockTaskService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);
      expect(result).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('update', () => {
    it('should update task and return success message', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Description',
        status: 'pending',
      };
      const mockTask = { id: 1, title: 'Updated Task' };
      mockTaskService.update.mockResolvedValue(mockTask);

      const result = await controller.update(updateTaskDto, 1);
      expect(result).toEqual({
        message: 'Task updated successfully',
        data: mockTask,
      });
      expect(service.update).toHaveBeenCalledWith(updateTaskDto, 1);
    });
  });

  describe('delete', () => {
    it('should delete task and return success message', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual({
        message: 'Task deleted successfully',
      });
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
