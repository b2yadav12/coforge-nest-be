
import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserLoginDto, LoginResponse } from './types';
import { comparePassword } from '../utils';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<LoginResponse> {

    // if user already exists
    const existingUser = await this.authService.getUserByEmail(body.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.authService.processUserSingup(body);

    // issue JWT token
    const token = this.authService.issueJwt(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: token,
    };
  }

  @Post('login')
  async login(@Body() loginPayload: UserLoginDto): Promise<LoginResponse> {
    const user = await this.authService.getUserByEmail(loginPayload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // @ts-ignore
    const isPasswordMatched = await comparePassword(loginPayload.password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // issue JWT token
    const token = this.authService.issueJwt(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: token,
    };
  }
}
