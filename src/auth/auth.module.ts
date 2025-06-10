import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { DBModelsModule } from '../db-models/db-models.module';
import { User } from '../db-models/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { getEnvOrThrow, getEnvOrDefault } from '../utils'

@Module({
  imports: [
    JwtModule.register({
      secret: getEnvOrThrow('JWT_SECRET'),
      signOptions: { expiresIn: getEnvOrDefault('JWT_EXPIRATION_TIME', '1h') },
    }),
    TypeOrmModule.forFeature([User]),
    DBModelsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {
  
}
