import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DATABASE_CONNECTION') private client: Client) {}

  async getUsers(): Promise<User[]> {
    const result = await this.client.query('select * from users;');
    return User.fromRows(result.rows);
  }
}
