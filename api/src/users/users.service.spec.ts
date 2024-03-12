import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { envVars } from '../constants';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
