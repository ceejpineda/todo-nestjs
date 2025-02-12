import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './repositories/task.repository';
import { HttpException } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

describe('TaskService', () => {
  let service: TaskService;
  let repository: TaskRepository;

  const mockTaskRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return tasks for valid userId', async () => {
      const mockTasks = [{ id: 1, title: 'Test Task' }];
      mockTaskRepository.findByUserId.mockResolvedValue(mockTasks);

      const result = await service.findByUserId(1);
      expect(result).toEqual(mockTasks);
    });

    it('should throw error if userId is invalid', async () => {
      mockTaskRepository.findByUserId.mockRejectedValue(
        new HttpException('Invalid user id', 400),
      );
      await expect(service.findByUserId(-1)).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        status: 'pending',
        userId: 1,
      };
      const mockTask = { id: 1, ...createTaskDto };
      mockTaskRepository.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update existing task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Description',
        status: 'pending',
      };
      const mockTask = { id: 1, title: 'Updated Task' };
      mockTaskRepository.findById.mockResolvedValue(mockTask);
      mockTaskRepository.update.mockResolvedValue(mockTask);

      const result = await service.update(updateTaskDto, 1);
      expect(result).toEqual(mockTask);
    });

    it('should throw error if task not found', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Description',
        status: 'pending',
      };
      mockTaskRepository.findById.mockResolvedValue(null);
      await expect(service.update(updateTaskDto, 1)).rejects.toThrow(
        'Task not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete existing task', async () => {
      const mockTask = { id: 1, title: 'Test Task' };
      mockTaskRepository.findById.mockResolvedValue(mockTask);

      await expect(service.delete(1)).resolves.not.toThrow();
    });

    it('should throw error if task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow('Task not found');
    });
  });
});
