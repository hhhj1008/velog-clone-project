import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entity/user.entity';

export const ValidateToken = createParamDecorator((_data, ctx: ExecutionContext): User => {
  const rawHeaders = ctx.switchToHttp().getRequest()['rawHeaders'];
  const auth_index = rawHeaders.indexOf('Authorization');

  if (auth_index !== -1) {
    const token = rawHeaders[auth_index + 1].replace('Bearer ', '');
    const user = jwt.verify(token, process.env.SECRET_KEY)['user'];
    return user;
  }
  return null;
});
