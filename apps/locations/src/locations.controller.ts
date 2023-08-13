import { Body, Controller, Delete, Get, Post, UseGuards, Inject } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationsService } from './locations.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from 'y/common';

@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly rmqService: RmqService,
  ) {}

  // @UseGuards(new UserAuthGuard())
  @Post('create')
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.createLocationForCustomer(createLocationDto);
  }

  @Get('get-all')
  getAllLocations() {
    return this.locationsService.getAllLocations();
  }

  @Delete('delete-all')
  deleteAllLocaitons() {
    return this.locationsService.deleteAllLocations();
  }

  @EventPattern('trip_created')
  async handleTripCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.locationsService.locate(data);
    this.rmqService.ack(context);
  }
}
