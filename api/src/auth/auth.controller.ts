import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(204)
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
  }
}
