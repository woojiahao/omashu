import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY, envVars } from '../../constants';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { User } from '../../users/users.entity';
import { JwtPayload } from '../auth.service';

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request: Request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['access'];

    if (!isPublic && !accessToken) {
      throw new UnauthorizedException();
    }

    try {
      if (accessToken) {
        const payload: JwtPayload =
          await this.jwtService.verifyAsync(accessToken, {
            secret: this.configService.getOrThrow<string>(envVars.jwt_secret),
          });

        const user = await this.usersService.getUserById(payload.id);
        request.user = user;
      }
    } catch (e) {
      throw new UnauthorizedException('Token has expired');
    }

    return true;
  }
}
