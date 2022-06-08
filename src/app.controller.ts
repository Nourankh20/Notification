import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  sendMail(to:string, stripeId:string) {
    return this.appService.orderCreated(to, stripeId,);
  }
}
