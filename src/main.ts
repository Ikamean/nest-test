import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import * as createRedisStore from 'connect-redis';
import * as session from 'express-session';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function main() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    url: configService.get('REDIS_URL'),
  });

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Roulette API')
    .setDescription('Roulette API for nest-test')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document);

  await app.listen(3000);
}
main();
