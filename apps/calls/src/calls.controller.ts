import { Controller, Get } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller()
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  getHello(): string {
    return this.callsService.getHello();
  }
}
