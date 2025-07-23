import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Log environment variables for debugging
  console.log('Environment check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000');

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

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

  await app.listen(3001);
  console.log('🚀 Server running on port 3001');
}

bootstrap();
