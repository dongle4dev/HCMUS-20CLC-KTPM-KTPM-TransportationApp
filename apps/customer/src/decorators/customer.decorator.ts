import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CustomerInfo {
  id: string;
  role: string;
  iat: number;
  exp: number;
}
export const Customer = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
