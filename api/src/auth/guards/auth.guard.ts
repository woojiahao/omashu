import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { envVars } from 'src/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access'];

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload: { sub: string; id: string } =
        await this.jwtService.verifyAsync(accessToken, {
          secret: this.configService.getOrThrow<string>(envVars.jwt_secret),
        });

      const user = this.usersService.getUserById(payload.id);
      request['user'] = user;
    } catch (e) {
      throw new UnauthorizedException('Token has expired');
    }

    return true;
  }
}
