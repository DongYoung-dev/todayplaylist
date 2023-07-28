import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ // cors 설정
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
