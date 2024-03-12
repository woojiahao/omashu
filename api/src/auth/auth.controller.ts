import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dtos/email-login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Response } from 'express';
import { isDevelopment } from '../utility/env.utility';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(204)
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }

  @Post('/login/email')
  @HttpCode(204)
  async loginWithEmail(
    @Body() loginDto: EmailLoginDto,
    @Res({ passthrough: true }) resp: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.loginWithEmail(
      loginDto,
    );
    const sameSite = isDevelopment() ? 'lax' : 'strict';
    resp.cookie('access', accessToken, { httpOnly: true, sameSite: sameSite });
    resp.cookie('refresh', refreshToken, {
      httpOnly: true,
      sameSite: sameSite,
    });
  }

  @Post('/login/google')
  @HttpCode(204)
  async loginWithGoogle() {}
}
