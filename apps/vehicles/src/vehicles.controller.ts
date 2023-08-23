import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CreateVehicleDto } from '../../../libs/common/src/dto/vehicle/dto/create.vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicle')
export class VehiclesController {
  constructor(
    private readonly vehicleService: VehiclesService,
    private readonly rmqService: RmqService,
  ) {}

  @UseGuards(new UserAuthGuard())
  @Post('register')
  registerVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
    @User() user: UserInfo,
  ) {
    console.log(user);
    return this.vehicleService.createVehicle(user, createVehicleDto);
  }

  @UseGuards(new UserAuthGuard())
  @Delete('delete-driver-vehicle')
  deleteDriverVehicle(@User() user: UserInfo) {
    return this.vehicleService.deleteDriverVehicle(user);
  }

  @Get()
  getAllVehicles() {
    return this.vehicleService.getAllVehicles();
  }

  @EventPattern('delete_vehicle_from_admin')
  deleteVehicle(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);
    this.vehicleService.deleteVehicle(data.vehicleID);
  }

  @MessagePattern('get_vehicles_from_admin')
  getVehicles(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);
    this.vehicleService.getAllVehicles();
  }
}
