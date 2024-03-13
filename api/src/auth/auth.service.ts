import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailLoginDto } from './dtos/email-login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { envVars } from '../constants';

export interface JwtPayload {
  sub: string;
  id: string;
}

type JwtToken = string;
export type JwtTokenPair = { accessToken: JwtToken; refreshToken: JwtToken };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    if (await this.usersService.getUserByEmail(registerDto.email)) {
      throw new HttpException(
        'User with email already exists',
        HttpStatus.CONFLICT,
      );
    }

    if (await this.usersService.getUserByUsername(registerDto.username)) {
      throw new HttpException(
        'User with username already exists',
        HttpStatus.CONFLICT,
      );
    }

    let passwordHash: string | null = null;
    const saltRounds = 10;
    if (registerDto.password) {
      passwordHash = await bcrypt.hash(registerDto.password, saltRounds);
    }

    await this.usersService.createUser(
      registerDto.email,
      registerDto.username,
      passwordHash,
    );
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
      const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>(envVars.jwt_secret),
      });

      // Reuse the old payload but update the refresh timings
      return await this.issueTokens(payload);
    } catch (e) {
      throw new UnauthorizedException('Cannot refresh token');
    }
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
}
