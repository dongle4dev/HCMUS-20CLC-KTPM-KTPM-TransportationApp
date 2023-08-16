import { Body, Controller, Delete, Get, Logger, Patch, Post, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { RmqService } from 'y/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UpdateTripLocationDto } from 'apps/hotlines/src/dto/update-trip.dto';

@Controller()
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({cmd: 'create_trip'})
  async createTrip(@Payload() createTripDto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.createTrip(createTripDto);
  }
  @Delete('delete-all')
  async deleteTrips() {
    return this.tripService.deleteAll();
  }
  @MessagePattern({ cmd: 'get_trips' })
  getAllTrip() {
    return this.tripService.getAllTrip();
  }

  @MessagePattern({ cmd: 'get_trips_by_phone_number' })
  getAllTripByPhoneNumber(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getAllTripsByPhoneNumber(data.phone);
  }

  @MessagePattern({ cmd: 'update_trip' })
  updateTripLocation(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.updateTripLocation(data.updateTripDto);
  }

  @Patch('test')
  updateTripTest(@Body() updateTripLocationDto: UpdateTripLocationDto) {
    return this.tripService.updateTripLocation(updateTripLocationDto);
  }
  @Get('')
  getAll() {
    return this.tripService.getAllTrip();
  }

  @Delete('delete-all')
  deleteAllTrip() {
    return this.tripService.deleteAllTrip();
  }

  @EventPattern('find_trip_tracking')
  findTripForTracking(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.tripService.findTripForTracking(data);
    this.rmqService.ack(context);
  }
}
