import { Body, Controller, Post } from '@nestjs/common';
import { DemandService } from './demand.service';

@Controller('discovery/demand')
export class DemandController {
  constructor(private readonly demandService: DemandService) {}
}
