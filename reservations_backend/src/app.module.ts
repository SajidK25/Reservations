import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    // Loads .env variables and makes them globally available
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Custom modules
    DatabaseModule,
    UsersModule,
    ReservationsModule,
    AuthModule,
  ],
  providers: [
    // Applies JWT guard globally (protects all routes by default)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
