import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';
import { Public } from '../metadatas/public.metadata';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Get('/current')
  getCurrentUser(@Req() request: Request) {
    return request.user;
  }

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }
}
