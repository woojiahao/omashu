import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailLoginDto } from './dtos/email-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async loginWithEmail(emailLoginDto: EmailLoginDto): Promise<{ accessToken: string, refreshToken: string }> {
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

    const payload = {
      sub: user.id,
      id: user.id,
    };

    const accessToken = await this.generateJwtToken(payload, 60 * 5);
    const refreshToken = await this.generateJwtToken(payload, 60 * 60 * 24 * 7);

    return {
      accessToken,
      refreshToken,
    }
  }

  /**
   *
   * @param payload Payload to include in token
   * @param expiry Expiry duration expressed in seconds
   */
  private async generateJwtToken(
    payload: { sub: string; id: string },
    expiry: number,
  ) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `${expiry}s`
    });
    return token;
  }
}
