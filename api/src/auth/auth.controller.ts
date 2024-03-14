import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService, JwtTokenPair } from './auth.service';
import { EmailLoginDto } from './dtos/email-login.dto';
import { RegisterDto } from './dtos/register.dto';
import { Response, Request, response } from 'express';
import { isDevelopment } from '../utility/env.utility';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

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
    const sameSite = isDevelopment() ? 'none' : 'strict';
    this.setCookie(resp, 'access', accessToken, true, sameSite);
    this.setCookie(resp, 'refresh', refreshToken, true, sameSite);
  }

  @Post('/login/google')
  @HttpCode(204)
  async loginWithGoogle() { }

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
      const { accessToken: access, refreshToken: refresh } = await this.authService.refreshToken(refreshToken)
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

  private setCookie(
    response: Response,
    key: string,
    value: string,
    httpOnly: boolean = true,
    sameSite: boolean | 'lax' | 'strict' | 'none' = 'none') {
    response.cookie(key, value, { httpOnly: httpOnly, sameSite: sameSite });
  }
}
