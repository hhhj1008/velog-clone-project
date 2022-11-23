import { CreateSocialUserDto } from 'src/dto/user/create-social-user.dto';
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
      title: login_id + '.log',
    });
    return await this.save(user);
  }

  async signupWithSocial(createSocialUserDto: CreateSocialUserDto) {
    const { name, email, login_id, about_me, provider, profile_image } =
      createSocialUserDto;
    const user = this.create({
      name,
      email,
      login_id,
      about_me,
      provider,
      profile_image,
      title: login_id + '.log',
    });

    return await this.save(user);
  }

  async updateUser(id: number, updateData: object) {
    await this.createQueryBuilder()
      .update()
      .set(updateData)
      .where('id = :id', { id })
      .execute();
  }

  async getUserByUserId(id: number, keys: string[]) {
    return await this.createQueryBuilder()
      .select(keys)
      .where('id = :id', { id })
      .execute();
  }

  async updateProfileImage(id: number, profile_image: string) {
    await this.createQueryBuilder()
      .update()
      .set({ profile_image })
      .where('id = :id', { id })
      .execute();
  }
}
