import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUsers() {
    return await this.usersRepository.getUsers();
  }

  async getUserById(id: string) {
    return await this.usersRepository.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserByUsername(username: string) {
    return await this.usersRepository.getUserByUsername(username);
  }

  async createUser(
    email: string,
    username: string,
    passwordHash: string | null,
  ) {
    await this.usersRepository.createUser(email, username, passwordHash);
  }
}
