import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(body: CreateUserDto) {
    try {
      const user = await this.userRepository.findByUsername(body.username);
      if (user) {
        throw new HttpException('Username already exists', 400);
      }

      const new_user = await this.userRepository.create(body);
      return plainToClass(UserResponseDto, new_user);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
