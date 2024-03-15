import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { isDevelopment } from '../utility/env.utility';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dtos/email-login.dto';
import { EmailRegisterDto } from './dtos/email-register.dto';
import { VerifyDto } from './dtos/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register/email')
  @HttpCode(204)
  async registerWithEmail(@Body() registerDto: EmailRegisterDto) {
    await this.authService.registerWithEmail(registerDto);
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
    const sameSite = isDevelopment() ? 'none' : 'strict';
    this.setCookie(resp, 'access', accessToken, true, sameSite);
    this.setCookie(resp, 'refresh', refreshToken, true, sameSite);
  }

  @Post('/login/google')
  @HttpCode(204)
  async loginWithGoogle() {}

  @Post('/logout')
  @HttpCode(204)
  async logout(@Res() response: Response) {
    response.clearCookie('access');
    response.clearCookie('refresh');
    response.end();
  }

  @Post('/refresh')
  @HttpCode(204)
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies['refresh'];
    try {
      const { accessToken: access, refreshToken: refresh } =
        await this.authService.refreshToken(refreshToken);
      const sameSite = isDevelopment() ? 'none' : 'strict';
      this.setCookie(response, 'access', access, true, sameSite);
      this.setCookie(response, 'refresh', refresh, true, sameSite);
    } catch (e) {
      response.clearCookie('access');
      response.clearCookie('refresh');
      response.end();
      throw e;
    }
  }

  @Post('/verify')
  @HttpCode(204)
  async verify(@Body() verifyDto: VerifyDto) {
    await this.authService.verify(verifyDto);
  }

  private setCookie(
    response: Response,
    key: string,
    value: string,
    httpOnly = true,
    sameSite: boolean | 'lax' | 'strict' | 'none' = 'none',
  ) {
    response.cookie(key, value, { httpOnly: httpOnly, sameSite: sameSite });
  }
}
