import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Log environment variables for debugging
  console.log('Environment check:');
  console.log('NODE_ENV:', configService.get('NODE_ENV'));
  console.log('JWT_SECRET set:', !!configService.get('JWT_SECRET'));
  console.log(
    'FRONTEND_URL:',
    configService.get('FRONTEND_URL', 'http://localhost:3000'),
  );

  // Enable CORS
  const allowedOrigins = (
    configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'
  ).split(',');
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable global prefix
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api'));

  // Enable cookie parser
  app.use(cookieParser());
  console.log('✅ Cookie parser enabled');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Data Structures API')
    .setDescription('API for learning data structures')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT', 3001);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
