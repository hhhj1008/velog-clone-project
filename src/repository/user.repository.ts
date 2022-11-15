import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkEmail(email: string) {
    const user = await this.findOne({ email });
    return user;
  }

  async checkLoginId(login_id: string) {
    const user = await this.findOne({ login_id });
    return user;
  }

  async findByLogin(user_id) {
    return await this.findOne({ id: user_id });
  }

  async signupWithEmail(createUserDto: CreateUserDto, hashedPassword: string) {
    const { email, name, about_me, login_id } = createUserDto;
    const user = this.create({
      email,
      name,
      password: hashedPassword,
      login_id,
      about_me,
    });
    await this.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const {
      profile_image,
      title,
      name,
      about_me,
      comment_alert,
      update_alert,
    } = updateUserDto;

    let query: string = `UPDATE user SET `;
    let condition: string[] = [];
    let where: string = `WHERE id = ?;`;

    let params: (number | string | Boolean)[] = [];

    if (profile_image) {
      condition.push(`profile_image = ?`);
      params.push(profile_image);
    }
    if (title) {
      condition.push(`title = ?`);
      params.push(title);
    }
    if (name) {
      condition.push(`name = ?`);
      params.push(name);
    }
    if (about_me) {
      condition.push(`about_me = ?`);
      params.push(about_me);
    }
    if (comment_alert === 0 || comment_alert === 1) {
      condition.push(`comment_alert = ? `);
      params.push(comment_alert);
    }
    if (update_alert === 0 || update_alert === 1) {
      condition.push(`update_alert = ? `);
      params.push(update_alert);
    }
    const conditions: string = condition.join(`,`);
    params.push(id);

    query = query + conditions + where;

    await this.query(query, params);
  }

  async getUserByUserId(id: number) {
    const user = await this.query(
      `
        SELECT user.id, user.name, user.email, user.profile_image, user.title, user.about_me, user.comment_alert, user.update_alert,
          social_info.email as social_info_email, social_info.github as social_info_github, social_info.twitter as social_info_twitter, social_info.facebook as social_info_facebook, social_info.url as social_info_url
        FROM user
        LEFT JOIN social_info ON user.id = social_info.userId
        WHERE user.id = ?;
      `,
      [id],
    );
    return user;
  }
}
