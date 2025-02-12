import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return this.repository.findOne({ where: { username } });
  }

  async create(body: { username: string; password: string }) {
    return this.repository.save(body);
  }
}
