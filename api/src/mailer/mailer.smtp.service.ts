import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerService } from './mailer.service';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { envVars } from '../constants';

@Injectable()
export class MailerSMTPService implements MailerService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    console.log({
      host: configService.getOrThrow<string>(envVars.email_host),
      port: configService.getOrThrow<number>(envVars.email_port),
    });
    this.transporter = createTransport({
      host: configService.getOrThrow<string>(envVars.email_host),
      port: configService.getOrThrow<number>(envVars.email_port),
      secure: configService.getOrThrow<number>(envVars.email_port) === 465,
      auth: {
        user: configService.getOrThrow<string>(envVars.email_username),
        pass: configService.getOrThrow<string>(envVars.email_password),
      },
    });
  }

  async send(
    subject: string,
    htmlBody: string,
    options: MailerOptions,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: options.from
        ? options.from
        : this.configService.getOrThrow<string>(envVars.email_username),
      to: options.to,
      subject: subject,
      html: htmlBody,
      cc: options.cc && [],
      bcc: options.bcc && [],
    });
  }
}
