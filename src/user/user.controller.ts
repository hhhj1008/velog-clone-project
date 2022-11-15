import {
  Controller,
  HttpCode,
  Patch,
  UsePipes,
  Request,
  ValidationPipe,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: Request,
  ) {
    const { id } = req['user'];
    const data = await this.userService.updateUser(id, updateUserDto);
    return { message: 'update user success', data: data };
  }
}
