import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/repository/user.repository';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
  ) {}

  async sendEmail(email: string) {
    const code: string = Math.round(Math.random() * 10000).toString();
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'velog-clone-project@naver.com', // Senders email address
        subject: 'Velog-clone-project signup code ✔', // Subject line
        text: `signup code is : ${code}`, // plaintext body
        html: `<b>signup code is : ${code}</b>`, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
    return code;
  }

  async checkEmail(email: string) {
    return await this.userRepository.checkEmail(email);
  }

  async signupWithEmail(createUserDto: CreateUserDto) {
    Logger.log('Signup with Email Service Start');

    Logger.log('Create Hashed Password Start');
    const password: string = createUserDto.password;
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);
    Logger.log('Create Hashed Password End');

    await this.userRepository.signupWithEmail(createUserDto, hashedPassword);
    Logger.log('Signup with Email Service End');
  }
}
