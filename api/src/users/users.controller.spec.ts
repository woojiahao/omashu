import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from './users.module';
import { databaseProviders } from '../database/database.provider';
import { Client } from 'pg';
import { envVars } from '../constants';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            getUsers: jest.fn(),
            getUserById: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider('DATABASE_CONNECTION')
      .useFactory({
        inject: [ConfigService],
        factory: async (config: ConfigService): Promise<Client> => {
          const databaseUrl = config.getOrThrow<string>(envVars.test_db_url);
          const client = new Client({ connectionString: databaseUrl });
          await client.connect();
          return client;
        },
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
