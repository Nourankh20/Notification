import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // console.log('process.env.sendgrid_api_key', process.env.sendgrid_api_key)
}
bootstrap();
