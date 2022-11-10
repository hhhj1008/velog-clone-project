import { Body, ConflictException, Controller, Get } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async checkEmail(@Body('email') email: string) {
    const user = await this.userService.checkEmail(email);

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
    const code = await this.authService.sendEmail(email);
    return Object.assign({ message: 'Send Email', signup_code: code });
  }
}
