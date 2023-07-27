import { Body, Controller, Post } from '@nestjs/common';
import { SupplyService } from './supply.service';

@Controller('discovery/supply')
export class SupplyController {
  constructor(private readonly SupplyService: SupplyService) {}
}
