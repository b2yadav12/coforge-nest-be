import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefaultDataSource } from './common/db-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBModelsModule } from './db-models/db-models.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DefaultDataSource.options),
    DBModelsModule,
    AuthModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
