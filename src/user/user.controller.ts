import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Redirect,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  async signupWithEmail(
    @Query('type') type: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    if (type === 'email') {
      Logger.log('Signup with Email Controller Start');
      await this.userService.signupWithEmail(createUserDto);
      Logger.log('Signup with Email Controller End');
    } else if (type === 'github') {
      return Object.assign({ message: 'github signup' });
    } else if (type === 'google') {
      return Object.assign({ message: 'google signup' });
    } else if (type === 'facebook') {
      return Object.assign({ message: 'facebook signup' });
    } else {
      throw new BadRequestException(
        'Type must to be `email` or `github` or `google` or `facebook`',
      );
    }
    return Object.assign({ message: `Signup with ${type} successful` });
  }
}
