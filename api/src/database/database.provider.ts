import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { envVars } from 'src/constants';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<Client> => {
      const databaseUrl = config.getOrThrow<string>(envVars.db_url);
      const client = new Client({ connectionString: databaseUrl });
      await client.connect();
      return client;
    },
  },
];
