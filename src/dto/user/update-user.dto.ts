import { PickType } from '@nestjs/mapped-types';
import { Allow, IsEnum, Length } from 'class-validator';
import {
  IsBooleanOrNull,
  IsEmailOrNull,
  IsUrlOrNull,
} from 'src/validations/user.validation';

/**
 * profile_image, name, title, about_me, social_info_email, social_info_github, social_info_twitter, social_info_facebook, social_info_url, comment_alert, update_alert
 */
export class UpdateUserDto {
  @Allow()
  name?: string;

  @Allow()
  about_me?: string;

  @Allow()
  profile_image?: string;

  @Allow()
  title?: string;

  @IsEmailOrNull({ message: 'social_info_email must be a Email or Null' })
  social_info_email?: string;

  @Allow()
  social_info_github?: string;

  @Allow()
  social_info_twitter?: string;

  @Allow()
  social_info_facebook?: string;

  @IsUrlOrNull({ message: 'social_info_url must be a Url or Null' })
  social_info_url?: string;

  @IsBooleanOrNull({ message: 'comment_alert must be a 1 or 0 or Null' })
  comment_alert?: number;

  @IsBooleanOrNull({ message: 'update_alert must be a 1 or 0 or Null' })
  update_alert?: number;

  @IsEnum(['social_info', 'user'], {
    message: 'type must be a valid enum value. [social_info, user]',
  })
  type: string;
}

export class SocialInfoDto extends PickType(UpdateUserDto, [
  'social_info_email',
  'social_info_github',
  'social_info_twitter',
  'social_info_facebook',
  'social_info_url',
] as const) {}
