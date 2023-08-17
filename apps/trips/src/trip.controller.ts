import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @MessagePattern({ cmd: 'create_trip' })
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

  @MessagePattern({ cmd: 'update_trip_status_from_driver' })
  updateTripStatusByDriver(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.updateTripStatus(data.updateTripStatusDto);
  }
  @MessagePattern({ cmd: 'get_all_trips_from_driver' })
  getAllDriverTrips(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getAllDriverTrips(data.id);
  }
  @MessagePattern({ cmd: 'get_revenue_trips_from_driver' })
  getDriverRevenue(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getDriverRevenue(data.id);
  }

  @MessagePattern({ cmd: 'get_revenue_week_trips_from_driver' })
  getDriverRevenueByWeek(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getDriverRevenueByWeek(data.id, data.week);
  }

  @MessagePattern({ cmd: 'get_revenue_month_trips_from_driver' })
  getDriverRevenueByMonth(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getDriverRevenueByMonth(data.id, data.month);
  }

  @MessagePattern({ cmd: 'get_trips_from_admin' })
  getAllTrips(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getAllTrip();
  }

  @MessagePattern({ cmd: 'get_cancel_trips_from_admin' })
  getCancelTrips(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getCancelTrip();
  }

  @MessagePattern({ cmd: 'get_finish_trips_from_admin' })
  getFinishTrips(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getFinishTrip();
  }
}
