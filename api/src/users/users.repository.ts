import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DATABASE_CONNECTION') private client: Client) {}

  async getUsers(): Promise<User[]> {
    const result = await this.client.query('select * from users;');
    return result.rows as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.client.query(
      'select * from users where id = $1',
      [id],
    );
    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0] as User;
  }
}
