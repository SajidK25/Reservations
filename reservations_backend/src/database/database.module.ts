import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Pool } from 'pg';

@Module({
  // Import .env configuration
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // Create and return a PostgreSQL connection pool
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
  // Export the database connection so it can be used elsewhere
  exports: ['PG'],
})
export class DatabaseModule {}
