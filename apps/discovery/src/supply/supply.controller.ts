import { Body, Controller, Get, Post } from '@nestjs/common';
import { StorePositionDto } from './dto/storePosition.dto';
import { SupplyService } from './supply.service';

@Controller('discovery/supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get()
  supplyPosition(@Body() storePositionDto: StorePositionDto) {
    return this.supplyService.supplyPosition(storePositionDto);
  }
}
