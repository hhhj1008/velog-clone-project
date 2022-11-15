import { PartialType, PickType } from '@nestjs/mapped-types';
import { Allow, IsBoolean, IsEmail, IsUrl } from 'class-validator';
import {
  IsBooleanOrNull,
  IsEmailOrNUll,
  IsUrlOrNull,
} from 'src/validations/user.validation';
import { CreateUserDto } from './create-user.dto';

/**
 * profile_image, name, title, about_me, social_info_email, social_info_github, social_info_twitter, social_info_facebook, social_info_url, comment_alert, update_alert
 */
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name', 'about_me'] as const),
) {
  @Allow()
  profile_image?: string;

  @Allow()
  title?: string;

  @IsEmailOrNUll({ message: 'social_info_email must be a Email or Null' })
  social_info_email?: string;

  @Allow()
  social_info_github?: string;

  @Allow()
  social_info_twitter?: string;

  @Allow()
  social_info_facebook?: string;

  @IsUrlOrNull({ message: 'social_info_url must be a Url or Null' })
  social_info_url?: string;

  @IsBooleanOrNull({ message: 'comment_alert must be a Boolean or Null' })
  comment_alert?: boolean;

  @IsBooleanOrNull({ message: 'update_alert must be a Boolean or Null' })
  update_alert?: boolean;
}
