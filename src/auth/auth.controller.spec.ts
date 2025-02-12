import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { HttpException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'password123',
    };

    const mockResponse = {
      token: 'jwt-token',
      user: {
        id: 1,
        username: 'testuser',
      },
    };

    it('should return token and user data on successful login', async () => {
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockResponse);
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(service.login).toHaveBeenCalledTimes(1);
    });

    it('should handle unauthorized error', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle user not found error', async () => {
      mockAuthService.login.mockRejectedValue(
        new HttpException('User not found', 404),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(HttpException);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle internal server error', async () => {
      mockAuthService.login.mockRejectedValue(
        new HttpException('Internal Server Error', 500),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(HttpException);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
