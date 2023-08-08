import { Controller, Get } from '@nestjs/common';
import { DemandService } from './demand.service';

@Controller()
export class DemandController {
  constructor(private readonly demandService: DemandService) {}

  @Get()
  getHello(): string {
    return this.demandService.getHello();
  }
}
