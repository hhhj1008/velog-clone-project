import { CreateUserDto } from 'src/dto/user/create-user.dto';
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

  async updateUser(id: number, keys: string[], values: any[]) {
    let query: string = `UPDATE user SET `;
    let condition: string = ``;
    let where: string = ` WHERE id = ?;`;

    if (
      keys.includes('name') &&
      !(
        keys.includes('title') ||
        keys.includes('comment_alert') ||
        keys.includes('update_alert') ||
        keys.includes('profile_image')
      )
    ) {
      condition = `name = ?, about_me = ?`;
      if (keys.length === 1) {
        values.push('');
      }
    } else if (
      keys.includes('title') &&
      !(
        keys.includes('name') ||
        keys.includes('about_me') ||
        keys.includes('comment_alert') ||
        keys.includes('update_alert')
      )
    ) {
      condition = `title = ?`;
    } else if (
      keys.includes('comment_alert') &&
      keys.includes('update_alert') &&
      !(
        keys.includes('name') ||
        keys.includes('about_me') ||
        keys.includes('title')
      )
    ) {
      condition = `comment_alert = ?, update_alert = ?`;
    } else if (
      keys.includes('profile_image') &&
      !(
        keys.includes('name') ||
        keys.includes('about_me') ||
        keys.includes('title') ||
        keys.includes('comment_alert') ||
        keys.includes('update_alert')
      )
    ) {
      condition = `profile_image = ?`;
    } else if (
      !(
        keys.includes('profile_image') ||
        keys.includes('name') ||
        keys.includes('about_me') ||
        keys.includes('title') ||
        keys.includes('comment_alert') ||
        keys.includes('update_alert')
      )
    ) {
      keys.push('profile_image');
      values.push('');
      condition = `profile_image = ?`;
    } else {
      throw new Error(
        '(name && about_me?) || (title) || (comment_alert && update_alert) || (profile_image)',
      );
    }

    values.push(id);

    query = query + condition + where;

    await this.query(query, values);
  }

  async getUserByUserId(id: number, keys: string[]) {
    if (keys.length === 1 && keys.includes('name')) {
      keys.push('about_me');
    }
    const key = keys.join(', ');

    const user = await this.query(
      `
        SELECT ${key} FROM user WHERE id = ?;
      `,
      [id],
    );

    return user;
  }
}
