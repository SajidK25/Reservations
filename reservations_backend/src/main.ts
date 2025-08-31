import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create a NestJS application using the main AppModule
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow cross-origin requests
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Start the application and listen on port 3000 on all network interfaces
  await app.listen(3000, '0.0.0.0');
}

bootstrap(); // Run
