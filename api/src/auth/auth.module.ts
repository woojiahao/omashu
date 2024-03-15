import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { envVars } from '../constants';
import { MailerService } from '../mailer/mailer.service';
import { MailerSMTPService } from '../mailer/mailer.smtp.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(envVars.jwt_secret),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: MailerService,
      useClass: MailerSMTPService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
