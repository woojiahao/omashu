import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Client } from 'pg';
import { envVars } from '../constants';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            loginWithEmail: jest.fn(),
          },
        },
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
