import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Pool({
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          user: config.get('DB_USER'),
          password: config.get('DB_PASS'),
          database: config.get('DB_NAME'),
        });
      },
    },
  ],
  exports: ['PG'],
})
export class DatabaseModule {}
