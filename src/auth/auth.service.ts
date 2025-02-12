import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findByUsername(loginDto.username);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      if (user.password !== loginDto.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        username: user.username,
      };

      return {
        token: await this.jwtService.signAsync(payload),
        user: {
          id: user.id,
          username: user.username,
        },
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
