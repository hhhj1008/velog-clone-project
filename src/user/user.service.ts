import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UserRepository } from 'src/repository/user.repository';
import { Connection } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  private userRepository: UserRepository;
  constructor(private readonly connection: Connection) {
    this.userRepository = this.connection.getCustomRepository(UserRepository);
  }

  async checkEmail(email: string) {
    return await this.userRepository.checkEmail(email);
  }

  async checkLoginId(login_id: string) {
    return await this.userRepository.checkLoginId(login_id);
  }

  async signupWithEmail(createUserDto: CreateUserDto) {
    Logger.log('Signup with Email Service Start');
    Logger.log('Check login_id is duplicate');
    const login_id: string = createUserDto.login_id;
    const select_login_id = await this.checkLoginId(login_id);

    if (select_login_id) {
      throw new ConflictException('다른 ID를 사용해주세요.');
    }
    const password: string = createUserDto.password;
    Logger.log('Create Hashed Password Start');
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);
    Logger.log('Create Hashed Password End');

    await this.userRepository.signupWithEmail(createUserDto, hashedPassword);
    Logger.log('Signup with Email Service End');
  }
}
