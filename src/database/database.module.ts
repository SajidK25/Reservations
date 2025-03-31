import { Module } from '@nestjs/common';
import { Pool } from 'pg';

const dbProvider = {
  provide: 'PG',
  useFactory: () => {
    return new Pool({
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  },
};

@Module({
  providers: [dbProvider],
  exports: ['PG'],
})
export class DatabaseModule {}
