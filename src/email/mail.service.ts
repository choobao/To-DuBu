import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  sendRegisterMail(userEmail: string, token: string): boolean {
    const bodyOption = this.registerBody(token);

    this.mailerService
      .sendMail({
        to: userEmail,
        ...bodyOption,
      })
      .then((result) => {})
      .catch((error) => {
        new ConflictException(error);
      });

    return true;
  }

  sendInvitationMail(userEmail: string, token: string): boolean {
    const bodyOption = this.invitationBody(token);

    this.mailerService
      .sendMail({
        to: userEmail,
        ...bodyOption,
      })
      .then((result) => {})
      .catch((error) => {
        new ConflictException(error);
      });

    return true;
  }

  private registerBody(token: string): { subject: string; html: string } {
    const url = `http://${this.config.get('HOST')}:${this.config.get('PORT')}/users/email-verify?signupVerifyToken=${token}`;
    return {
      subject: '가입 인증 메일',
      html: `
          가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
          <form action="${url}" method="POST">
            <button>가입하기</button>
          </form>
        `,
    };
  }

  private invitationBody(token: string): { subject: string; html: string } {
    const url = `http://${this.config.get('HOST')}:${this.config.get('PORT')}/boards/accept/${token}`;
    return {
      subject: '보드 초대 메일',
      html: `
          새로운 보드에 초대되었습니다!<br/>
          <form action="${url}" method="POST">
            <button>초대 수락하기</button>
          </form>
        `,
    };
  }
}
