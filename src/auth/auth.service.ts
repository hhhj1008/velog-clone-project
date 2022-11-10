import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {}
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
}
