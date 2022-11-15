import { Injectable } from '@nestjs/common';
import { SocialInfoDto, UpdateUserDto } from 'src/dto/user/update-user.dto';
import { SocialInfoRepository } from 'src/repository/social-info.repository';
import { UserRepository } from 'src/repository/user.repository';
import { Connection } from 'typeorm';

@Injectable()
export class UserService {
  private userRepository: UserRepository;
  private socialInfoRepository: SocialInfoRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.socialInfoRepository =
      this.connection.getCustomRepository(SocialInfoRepository);
  }

  async findOne(login_id: string) {
    return this.userRepository.findByLogin(login_id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const {
      social_info_email,
      social_info_github,
      social_info_twitter,
      social_info_facebook,
      social_info_url,
    } = updateUserDto;
    const socialInfoDto: SocialInfoDto = {
      social_info_email,
      social_info_github,
      social_info_twitter,
      social_info_facebook,
      social_info_url,
    };
    await this.userRepository.updateUser(id, updateUserDto);

    await this.socialInfoRepository.updateSocialInfo(id, socialInfoDto);

    const data = await this.userRepository.getUserByUserId(id);
    return data;
  }
}
