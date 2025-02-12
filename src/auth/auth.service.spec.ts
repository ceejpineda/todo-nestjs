import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const mockUserRepository = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      password: 'password123',
    };

    it('should login successfully and return token', async () => {
      const mockToken = 'jwt-token';
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
        },
      });
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
      });
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException('User not found', 404),
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw error when password is invalid', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      const invalidLoginDto = { ...loginDto, password: 'wrongpassword' };

      await expect(service.login(invalidLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should handle internal server error', async () => {
      mockUserRepository.findByUsername.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException('Internal Server Error', 500),
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
