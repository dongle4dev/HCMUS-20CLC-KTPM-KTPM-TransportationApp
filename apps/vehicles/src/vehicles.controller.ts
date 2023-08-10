import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CreateVehicleDto } from './dto/create.vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicle')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

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
  @Delete('delete')
  deleteVehicle(@User() user: UserInfo) {
    return this.vehicleService.deleteVehicle(user);
  }

  @Get()
  getAllVehicles() {
    return this.vehicleService.getAllVehicles();
  }
}
