import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUserRepository = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      const mockNewUser = {
        id: 1,
        ...createUserDto,
      };
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockNewUser);

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.username).toBe(createUserDto.username);
      expect(result).not.toHaveProperty('password');
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        createUserDto.username,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw error if username already exists', async () => {
      mockUserRepository.findByUsername.mockResolvedValue({
        id: 1,
        username: 'testuser',
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('Username already exists', 400),
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw internal server error for unknown errors', async () => {
      mockUserRepository.findByUsername.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        new HttpException('Internal Server Error', 500),
      );
    });
  });
});
