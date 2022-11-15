import { SocialInfoDto } from 'src/dto/user/update-user.dto';
import { SocialInfo } from 'src/entity/social-info.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SocialInfo)
export class SocialInfoRepository extends Repository<SocialInfo> {
  async updateSocialInfo(id: number, socialInfoDto: SocialInfoDto) {
    const {
      social_info_email,
      social_info_facebook,
      social_info_twitter,
      social_info_github,
      social_info_url,
    } = socialInfoDto;

    await this.upsert(
      [
        {
          user: id,
          email: social_info_email,
          facebook: social_info_facebook,
          twitter: social_info_twitter,
          github: social_info_github,
          url: social_info_url,
        },
      ],
      ['user'],
    );
  }
}
