import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefaultDataSource } from './common/db-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBModelsModule } from './db-models/db-models.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DefaultDataSource.options),
    DBModelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
