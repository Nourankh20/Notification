import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  

  @Get('/notify')
  sendMail() {
    return this.appService.orderCreated("nourankh201617@gmail.com", "stripeId",);
  }
}
