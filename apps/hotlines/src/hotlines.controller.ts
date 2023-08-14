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

@Controller('hotlines')
export class HotlinesController {
  constructor(
    private readonly hotlinesServiceFacade: HotlinesServiceFacade,
    private readonly hotlinesService: HotlinesService,
  ) {}

  @Post('/signup')
  signUp(
    @Body() signUpHotlineDto: SignUpHotlineDto,
  ): Promise<{ token: string }> {
    return this.hotlinesServiceFacade.signUpFacade(signUpHotlineDto);
  }

  @Post('/login')
  login(@Body() loginHotlineDto: LoginHotlineDto): Promise<{ token: string }> {
    return this.hotlinesServiceFacade.loginFacade(loginHotlineDto);
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update')
  updateAccount(
    @Body() updateHotlineDto: UpdateHotlineDto,
    @User() hotline: UserInfo,
  ) {
    return this.hotlinesServiceFacade.updateAccountFacade(
      updateHotlineDto,
      hotline.id,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete')
  deleteAccount(@User() hotline: UserInfo) {
    return this.hotlinesServiceFacade.deleteAccountFacade(hotline.id);
  }

  // @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() hotline: UserInfo) {
    console.log(hotline);
    return this.hotlinesServiceFacade.getAllFacade();
  }

  @Delete('/delete-all')
  deleteAllDrivers() {
    return this.hotlinesServiceFacade.deleteAllFacade();
  }

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

  @Post('/trip')
  createTrip(@Body() createTripDto: CreateTripDto) {
    return this.hotlinesService.createTrip(createTripDto);
  }

  @Post('/tracking-trip')
  trackingTrip(@Body() trackingTripDto: TrackingTripDto) {
    return this.hotlinesService.trackingTrip(trackingTripDto);
  }
}
