import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

    await this.usersService.createUser(
      registerDto.email,
      registerDto.username,
      registerDto.password,
    );
  }
}
