import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const AuthDecorator = createParamDecorator(
  (_data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'];
    return user;
  },
);

export const AUTH_REQUIRED_KEY = 'isProtected';

// Mark a route as requiring authentication
export const RequiresLogin = () => SetMetadata(AUTH_REQUIRED_KEY, true);
