import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailRegisterDto } from './dtos/email-register.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailLoginDto } from './dtos/email-login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { envVars } from '../constants';
import { MailerService } from '../mailer/mailer.service';
import { isDevelopment } from '../utility/env.utility';
import { VerifyDto } from './dtos/verify.dto';
import { User } from '../users/users.entity';

export interface JwtPayload {
  sub: string;
  id: string;
}

type JwtToken = string;
export type JwtTokenPair = { accessToken: JwtToken; refreshToken: JwtToken };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(MailerService) private readonly mailerService: MailerService,
  ) {}

  /**
   * Registers a user given their email and username and triggers email verification.
   */
  async registerWithEmail({ email, username, password }: EmailRegisterDto) {
    if (await this.usersService.getUserByEmail(email)) {
      throw new HttpException(
        'User with email already exists',
        HttpStatus.CONFLICT,
      );
    }

    if (await this.usersService.getUserByUsername(username)) {
      throw new HttpException(
        'User with username already exists',
        HttpStatus.CONFLICT,
      );
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
      await this.usersService.createUser(email, username, passwordHash);

      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        throw new HttpException(
          'Something happened internally',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // This takes a while so we just let it run in the background instead
      this.sendVerificationEmail(email, username, user.id);
    } catch (e) {
      throw e;
    }
  }

  async loginWithEmail(emailLoginDto: EmailLoginDto): Promise<JwtTokenPair> {
    const user = await this.usersService.getUserByEmail(emailLoginDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      emailLoginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return this.issueTokens({
      sub: user.id,
      id: user.id,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>(envVars.jwt_secret),
        },
      );

      // Reuse the old payload but update the refresh timings
      return await this.issueTokens(payload);
    } catch (e) {
      throw new UnauthorizedException('Cannot refresh token');
    }
  }

  async verify({ token: id }: VerifyDto) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.is_verified) {
      throw new HttpException(
        'User is already verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.usersService.verifyUser(id);
  }

  resendVerification({ email, username, id }: User) {
    // Run this in the background to avoid pausing the server just for sending emails
    this.sendVerificationEmail(email, username, id);
  }

  private async issueTokens(payload: JwtPayload): Promise<JwtTokenPair> {
    const accessToken = await this.generateJwtToken(payload, 60 * 5);
    const refreshToken = await this.generateJwtToken(payload, 60 * 60 * 24 * 7);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate JWT token given payload with user id
   * @param payload Payload to include in token
   * @param expiry Expiry duration expressed in seconds
   */
  private async generateJwtToken(
    payload: JwtPayload,
    expiry: number,
  ): Promise<JwtToken> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `${expiry}s`,
    });
    return token;
  }

  private sendVerificationEmail(to: string, username: string, userId: string) {
    const url = isDevelopment()
      ? 'http://localhost:5173/auth/verify?token='
      : `${this.configService.getOrThrow<string>(
          envVars.this_url,
        )}/auth/verify?token=`;

    const mail = `
    <h3>Thank you for registering with Omashu ${username}!</h3>
    <p>We are very excited for you to be on our platform. Before we begin, please verify your registration by going to the link below!<p>
    <a href="${url}${userId}">Click here to verify your email</a>
    <p>Cheers!</p>
    <p>Omashu Team</p>
    `.trim();

    this.mailerService.send('Verify your registration on Omashu', mail, {
      to: [to],
    });
  }
}
