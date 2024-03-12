import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUsers() {
    return await this.usersRepository.getUsers();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserByUsername(username: string) {
    return await this.usersRepository.getUserByUsername(username);
  }

  async createUser(email: string, username: string, password: string | null) {
    let passwordHash: string | null = null;
    const saltRounds = 10;
    if (password) {
      passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await this.usersRepository.createUser(email, username, passwordHash);
  }
}
