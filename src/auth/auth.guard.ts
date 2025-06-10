import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AUTH_REQUIRED_KEY } from '../utils/auth.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Check if route is explicitly marked as protected
    const isProtected = this.reflector.getAllAndOverride<boolean>(AUTH_REQUIRED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Skip authentication if neither protected nor in LOGGEDIN_APIS
    if (!isProtected) {
      console.log(`Skipping authentication for unprotected route ${request.method} ${request.url}`);
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing or invalid token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_type, token] = request.headers['authorization']?.split(' ') ?? [];
    return token;
  }
}
