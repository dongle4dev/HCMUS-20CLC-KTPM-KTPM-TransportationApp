import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { User, UserInfo } from './decorators/user.decorator';
import { CreateVehicleDto } from './dto/create.vehicle.dto';
import { UserAuthGuard } from './guards/local-auth.guard';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @UseGuards(new UserAuthGuard())
  @Post('register')
  registerVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
    @User() user: UserInfo,
  ) {
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