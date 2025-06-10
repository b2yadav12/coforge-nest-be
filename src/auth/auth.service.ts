import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User as UserEntity } from '../db-models/entities/user.entity';
import { CreateUserDto, User } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async processUserSingup(
    data: CreateUserDto,
  ): Promise<User> {

    const user = new UserEntity();
    user.name = data.name;
    user.email = data.email;
    user.password = data.password || '';
    return await this.userRepository.save(user);
  }

  async getUserByEmail(text: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :text', { text })
      .addSelect('user.password')
      .getOne();
  }

  issueJwt(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}
