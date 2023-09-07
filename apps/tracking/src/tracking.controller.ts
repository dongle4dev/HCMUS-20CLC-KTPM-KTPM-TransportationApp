import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Inject,
  Sse,
  Put,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateTripDto } from 'y/common';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';

interface IMessage {
  data: string | object;
}

@Controller('tracking-trip')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Sse('new-trip')
  newTripListener() {
    return this.trackingService.newTripListener();
  }

  @Sse('update-trip')
  updateTripListener() {
    return this.trackingService.updateTripListener();
  }

  @Post('new-trip')
  async newTrip(@Body() createTripDio): Promise<IMessage> {
    return await this.trackingService.newTrip(createTripDio);
  }

  @Post('update-trip')
  async updateTrip(@Body() updateTripDto): Promise<IMessage> {
    return await this.trackingService.updateTrip(updateTripDto);
  }
}
