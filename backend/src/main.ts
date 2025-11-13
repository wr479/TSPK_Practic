import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const swaggerEnabled =
    config.get<string>('SWAGGER_ENABLED', 'true') === 'true';

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN')?.split(',') ?? '*',
    credentials: true,
  });

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('TspkThee API')
      .setDescription(
        'Документация REST API для админки и публичных форм участия',
      )
      .setVersion('1.0.0')
      .addBasicAuth(
        {
          type: 'http',
          scheme: 'basic',
          description: 'Используйте ADMIN_LOGIN и ADMIN_PASSWORD',
        },
        'basic',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
      customSiteTitle: 'TspkThee API Docs',
    });
  }

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/', (_req: unknown, res: any) => {
    res.json({
      status: 'ok',
      message: 'Сервис работает, используйте /api для доступа к REST',
      timestamp: new Date().toISOString(),
    });
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,
    }),
  );

  const port = Number(config.get<string>('PORT', '3000'));
  await app.listen(port, '0.0.0.0');
}
bootstrap();
