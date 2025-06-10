import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LOGGEDIN_APIS } from "../common/constants";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private loggedinApis = LOGGEDIN_APIS;

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const path = request.url;
    const method = request.method;
    console.log(`Request for ${method} ${path}`);

    // if the request path is non logged-in API then skip authentication
    if(!this.loggedinApis[path] || !this.loggedinApis[path].includes(method)) {
      console.log(`Skipping authentication for ${method} ${path}`);
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_type, token] = request.headers['authorization']?.split(' ') ?? [];
    return token;
  }
}
