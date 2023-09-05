import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { CreateVehicleDto } from '../../../libs/common/src/dto/vehicle/dto/create.vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicle')
export class VehiclesController {
  constructor(
    private readonly vehicleService: VehiclesService,
    private readonly rmqService: RmqService,
  ) {}

  @Post('register')
  registerVehicleTest(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Delete('delete-driver-vehicle/:user')
  deleteDriverVehicleTest(@Param('user') user: string) {
    return this.vehicleService.deleteDriverVehicle(user);
  }

  @Get()
  getAllVehicles() {
    return this.vehicleService.getAllVehicles();
  }

  @MessagePattern({ cmd: 'register_vehicle_from_driver' })
  registerVehicle(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.vehicleService.createVehicle(data.createVehicleDto);
  }
  @MessagePattern({ cmd: 'get_vehicle_from_driver' })
  getDriverVehicle(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.vehicleService.getDriverVehicle(data.id);
  }

  @EventPattern('delete_driver_vehicle_from_driver')
  deleteDriverVehicle(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.vehicleService.deleteDriverVehicle(data.id);
  }

  @EventPattern('delete_vehicle_from_admin')
  deleteVehicle(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.vehicleService.deleteVehicle(data.vehicleID);
  }

  @MessagePattern({ cmd: 'get_vehicles_from_admin' })
  getVehicles(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.vehicleService.getAllVehicles();
  }
}
