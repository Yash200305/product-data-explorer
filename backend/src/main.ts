import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Configuration } from 'crawlee';

const cfg = Configuration.getGlobalConfig();

console.log('CRAWLEE config logLevel=', cfg.get('logLevel'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(3000);
}
bootstrap();
