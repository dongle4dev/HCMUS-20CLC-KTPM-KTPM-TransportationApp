import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

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
}
