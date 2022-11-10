import { Logger } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { User } from 'src/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async checkEmail(email: string) {
    return await this.findOne({ email });
  }

  async checkLoginId(login_id: string) {
    return await this.findOne({ login_id: login_id });
  }

  async signupWithEmail(createUserDto: CreateUserDto, hashedPassword: string) {
    Logger.log('Signup with email Repository Start');
    const { email, name, about_me, login_id } = createUserDto;
    const user = this.create({
      email,
      name,
      password: hashedPassword,
      login_id,
      about_me,
    });
    await this.save(user);
    Logger.log('Signup with email Repository End');
  }
}
