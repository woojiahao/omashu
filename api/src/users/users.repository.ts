import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DATABASE_CONNECTION') private client: Client) {}

  async getUsers(): Promise<User[]> {
    try {
      const result = await this.client.query('select * from users;');
      return result.rows as User[];
    } catch (e) {
      throw new HttpException(
        'Something went wrong when retrieving user by email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const result = await this.client.query(
        'select * from users where id = $1',
        [id],
      );
      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (e) {
      throw new HttpException(
        'Something went wrong when retrieving user by email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.client.query(
        'select * from users where email = $1',
        [email],
      );
      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (e) {
      throw new HttpException(
        'Something went wrong when retrieving user by email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.client.query(
        'select * from users where username ilike $1',
        [username],
      );
      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (e) {
      throw new HttpException(
        'Something went wrong when retrieving user by username',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(
    email: string,
    username: string,
    passwordHash: string | null,
  ) {
    try {
      await this.client.query(
        'insert into users (email, username, password_hash) values ($1, $2, $3)',
        [email, username, passwordHash],
      );
    } catch (e) {
      throw new HttpException(
        'Something went wrong when creating a new user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
