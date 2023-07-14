import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AdminInfo {
  id: string;
  role: string;
  iat: number;
  exp: number;
}
export const Admin = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
