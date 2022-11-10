import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/email')
  async checkEmail(@Body('email') email: string) {
    const user = await this.authService.checkEmail(email);

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
    const code = await this.authService.sendEmail(email);
    return Object.assign({ message: 'Send Email', signup_code: code });
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  async signupWithEmail(
    @Query('type') type: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    switch (type) {
      case 'email':
        Logger.log('Signup with Email Controller Start');
        await this.authService.signupWithEmail(createUserDto);
        Logger.log('Signup with Email Controller End');

      case 'github':
        return Object.assign({ message: 'github signup' });

      case 'google':
        return Object.assign({ message: 'google signup' });

      case 'facebook':
        return Object.assign({ message: 'facebook signup' });

      default:
        throw new BadRequestException(
          'Type must to be `email` or `github` or `google` or `facebook`',
        );
    }
  }
}
