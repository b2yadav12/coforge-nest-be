import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
    ]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class DBModelsModule {}
