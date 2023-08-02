import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs'

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.todayplaylist.site/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.todayplaylist.site/cert.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  app.enableCors({ // cors 설정
    origin: [
      'http://localhost:3000',
      'https://todayplaylist.site',
      'https://www.todayplaylist.site'
    ],
    credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });

  app.use(cookieParser());

  await app.listen(443);
}
bootstrap();
