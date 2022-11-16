import {
  Controller,
  HttpCode,
  Patch,
  UsePipes,
  Request,
  ValidationPipe,
  UseGuards,
  Body,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SocialInfoDto, UpdateUserDto } from 'src/dto/user/update-user.dto';
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
    const {
      name,
      about_me,
      profile_image,
      title,
      social_info_email,
      social_info_facebook,
      social_info_github,
      social_info_twitter,
      social_info_url,
      update_alert,
      comment_alert,
      type,
    } = updateUserDto;
    try {
      let data: any = '';

      switch (type) {
        case 'social_info':
          if (
            name ||
            about_me ||
            profile_image ||
            title ||
            comment_alert ||
            update_alert
          ) {
            throw new BadRequestException(
              'social_info type must not includes name, title, profile_image, comment_alert, update_alert',
            );
          }

          const socialInfoDto: SocialInfoDto = {
            social_info_email: social_info_email || '',
            social_info_github: social_info_github || '',
            social_info_twitter: social_info_twitter || '',
            social_info_facebook: social_info_facebook || '',
            social_info_url: social_info_url || '',
          };

          data = await this.userService.updateSociaInfo(id, socialInfoDto);

          break;

        case 'user':
          if (
            social_info_email ||
            social_info_facebook ||
            social_info_github ||
            social_info_twitter ||
            social_info_url
          ) {
            throw new BadRequestException(
              'user type must not includes social_info_email, social_info_github, social_info_twitter, social_info_facebook, social_info_url',
            );
          }

          const updateData: object = {};
          for (const [key, value] of Object.entries(updateUserDto)) {
            if (value && key !== 'type') {
              updateData[key] = value;
            }
          }

          data = await this.userService.updateUser(id, updateData);

          break;
      }

      return { message: 'update user success', data: data };
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        console.log(err);
        throw new ForbiddenException(
          '유저 정보가 없습니다. 토큰을 확인해주세요.',
        );
      } else if (
        err.message ===
          '(name && about_me) || (title) || (comment_alert && update_alert) || (profile_image)' ||
        err.message ===
          'social_info type must not includes name, title, profile_image, comment_alert, update_alert' ||
        err.message ===
          'user type must not includes social_info_email, social_info_github, social_info_twitter, social_info_facebook, social_info_url' ||
        err.message ===
          '(name && about_me?) || (title) || (comment_alert && update_alert) || (profile_image)'
      ) {
        console.log(err);
        throw new BadRequestException(err.message);
      } else {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }
}
