import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create a NestJS application using the main AppModule
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow cross-origin requests
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Start the application and listen on port 3000 on all network interfaces
  await app.listen(3000, '0.0.0.0');
}

bootstrap(); // Run
