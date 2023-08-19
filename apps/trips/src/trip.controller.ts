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
import { CreateTripDto } from './dto/create-trip.dto';
import { CalculatePriceTripsDto } from './dto/calculate-price-trips.dto';

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

  @Post('create-trip')
  async createTripTest(@Body() createTripDto: CreateTripDto) {
    return this.tripService.createTrip(createTripDto);
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

  // DRIVER
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
  @MessagePattern({ cmd: 'get_revenue_by_time_trips_from_driver' })
  getDriverRevenueByTime(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getDriverRevenueByTime(data);
  }

  @MessagePattern({ cmd: 'get_all_revenue_trips_from_driver' })
  getDriverAllRevenue(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getDriverRevenue(data);
  }

  //CUSTOMER
  @MessagePattern({ cmd: 'get_all_trips_from_customer' })
  getAllCustomerTrips(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.getCustomerTrips(data.customer);
  }

  @MessagePattern({ cmd: 'cancel_trip_from_customer' })
  cancelCustomerTrip(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.tripService.cancelCustomerTrip(data.tripInfo);
  }

  @MessagePattern({ cmd: 'create_trip_from_customer' })
  async createTripFromCustomer(
    @Payload() createTripDto: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.tripService.createTrip(createTripDto);
  }

  @MessagePattern({ cmd: 'update_trip_from_customer' })
  updateTripLocationFromCustomer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.tripService.updateTripLocation(data.updateTripDto);
  }
  //ADMIN
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

  @MessagePattern({ cmd: 'calculate_trips_by_time_from_admin' })
  calculatePriceTripsByTimeForAdmin(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.tripService.calculatePriceTripsForAdmin(
      data.calculatePriceTripsDto,
    );
  }

  @MessagePattern({ cmd: 'calculate_all_trips_from_admin' })
  calculatePriceAllTripsForAdmin(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.tripService.calculatePriceAllTripsForAdmin();
  }
}
