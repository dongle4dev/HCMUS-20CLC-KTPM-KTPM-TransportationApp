import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { LocationBroadcastFromHotlineDto } from './dto/location-broadcast.hotline.dto';
import { LoginHotlineDto } from './dto/login.hotline.dto';
import { SignUpHotlineDto } from './dto/signup.hotline.dto';
import { UpdateHotlineDto } from './dto/update.hotline.dto';
import { HotlinesServiceFacade } from './hotlines.facade.service';
import { CreateTripDto } from 'apps/trips/src/dto/create-trip.dto';
import { HotlinesService } from './hotlines.service';
import { TrackingTripDto } from 'apps/tracking/src/dto/tracking-trip.dto';
import { UpdateTripLocationDto } from './dto/update-trip.dto';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';

@Controller('hotlines')
export class HotlinesController {
  constructor(
    // private readonly hotlinesServiceFacade: HotlinesServiceFacade,
    private readonly hotlinesService: HotlinesService,
  ) {}

  @Post('/trips')
  async createTrip(@Body() createTripDto: CreateTripDto) {
    this.hotlinesService.createTrip(createTripDto);
  }

  @Get('/trips')
  async getAllTrip() {
    return this.hotlinesService.getAllTrip();
  }

  @Get('/trips-customer-phone')
  async getAllTripsByPhoneNumber(@Body('phone') phone: string) {
    return this.hotlinesService.getAllTripByPhoneNumber(phone);
  }

  @Patch('/update-trip-location')
  async updateTrip(@Body() updateTripDto: UpdateTripLocationDto) {
    return this.hotlinesService.updateTrip(updateTripDto);
  }

  @Post('/broadcast-driver')
  async hotlineBroadCastToDriver(
    @Body() customerPositionDto: CustomerPositionDto,
  ) {
    return this.hotlinesService.broadCastToDrivers(customerPositionDto);
  }

  // @Post('/signup')
  // signUp(
  //   @Body() signUpHotlineDto: SignUpHotlineDto,
  // ): Promise<{ token: string }> {
  //   return this.hotlinesServiceFacade.signUpFacade(signUpHotlineDto);
  // }

  // @Post('/login')
  // login(@Body() loginHotlineDto: LoginHotlineDto): Promise<{ token: string }> {
  //   return this.hotlinesServiceFacade.loginFacade(loginHotlineDto);
  // }

  // @UseGuards(new UserAuthGuard())
  // @Patch('/update')
  // updateAccount(
  //   @Body() updateHotlineDto: UpdateHotlineDto,
  //   @User() hotline: UserInfo,
  // ) {
  //   return this.hotlinesServiceFacade.updateAccountFacade(
  //     updateHotlineDto,
  //     hotline.id,
  //   );
  // }

  // @UseGuards(new UserAuthGuard())
  // @Delete('/delete')
  // deleteAccount(@User() hotline: UserInfo) {
  //   return this.hotlinesServiceFacade.deleteAccountFacade(hotline.id);
  // }

  // @UseGuards(new UserAuthGuard())
  // @Get()
  // getAllUser(@User() hotline: UserInfo) {
  //   console.log(hotline);
  //   return this.hotlinesServiceFacade.getAllFacade();
  // }

  // @Delete('/delete-all')
  // deleteAllDrivers() {
  //   return this.hotlinesServiceFacade.deleteAllFacade();
  // }

  // @UseGuards(new UserAuthGuard())
  // @Post('/demand-order')
  // demandOrder(
  //   @Body() locationBroadcastFromHotlineDto: LocationBroadcastFromHotlineDto,
  // ) {
  //   const { latitude, longitude, day, broadcastRadius, phone, arrivalAddress } =
  //     locationBroadcastFromHotlineDto;
  //   const customerPositionDto = {
  //     phone,
  //     latitude,
  //     longitude,
  //     broadcastRadius,
  //     arrivalAddress,
  //     day,
  //   };
  //   return this.hotlinesServiceFacade.demandOrderFacade(customerPositionDto);
  // }
}
