import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { HttpException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
    };

    const userResponseDto: UserResponseDto = {
      id: 1,
      username: 'testuser',
    };

    it('should create a new user successfully', async () => {
      mockUserService.create.mockResolvedValue(userResponseDto);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(userResponseDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle user creation failure', async () => {
      mockUserService.create.mockRejectedValue(
        new HttpException('Username already exists', 400),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        new HttpException('Username already exists', 400),
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
