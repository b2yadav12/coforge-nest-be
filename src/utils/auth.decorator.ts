import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const AuthDecorator = createParamDecorator(
  (_data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'];
    return user;
  },
);

export const IS_PROTECTED_KEY = 'isProtected';
export const IS_PUBLIC_KEY = 'isPublic';

// Mark a route as requiring authentication
export const Protected = () => SetMetadata(IS_PROTECTED_KEY, true);
