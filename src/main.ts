import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { getEnvOrDefault } from './utils';
import { JwtAuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = getEnvOrDefault('PORT', '4000');

  const app = await NestFactory.create(AppModule, {});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Apply JWT Guard globally
  app.useGlobalGuards(app.get(JwtAuthGuard));

  await app.listen(port, () => {
    logger.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
