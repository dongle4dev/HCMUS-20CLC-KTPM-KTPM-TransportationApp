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
import {
  ClientProxy,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { RmqService } from 'y/common/rmq/rmq.service';
import { DriversServiceFacade } from './drivers.facade.service';
import { LocationDto } from './dto/location.dto';
import { LoginDriverDto } from './dto/login.driver.dto';
import { SignUpDriverDto } from './dto/signup.driver.dto';
import { UpdateDriverDto } from './dto/update.driver.dto';

@Controller('/drivers')
export class DriversController {
  constructor(
    private readonly driversServiceFacade: DriversServiceFacade,
    private readonly rmqService: RmqService, // @Inject('DEMAND_SERVICE') private demandService: ClientProxy,
  ) {}

  @Post('/signup')
  signUp(@Body() signUpDriverDto: SignUpDriverDto): Promise<{ token: string }> {
    return this.driversServiceFacade.signUpFacade(signUpDriverDto);
  }
  @Post('/login')
  login(@Body() loginDriverDto: LoginDriverDto): Promise<{ token: string }> {
    return this.driversServiceFacade.loginFacade(loginDriverDto);
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update')
  updateAccount(
    @Body() updateDriverDto: UpdateDriverDto,
    @User() driver: UserInfo,
  ) {
    return this.driversServiceFacade.updateAccountFacade(
      updateDriverDto,
      driver.id,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete')
  deleteAccount(@User() driver: UserInfo) {
    return this.driversServiceFacade.deleteAccountFacade(driver.id);
  }

  // @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() driver: UserInfo) {
    console.log(driver);
    return this.driversServiceFacade.getAllFacade();
  }

  @Delete('/delete-all')
  deleteAllDrivers() {
    return this.driversServiceFacade.deleteAllFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update-location')
  updateLocation(@Body() locationDto: LocationDto, @User() driver: UserInfo) {
    const { latitude, longitude, day } = locationDto;
    const driverPositionDto = {
      id: driver.id,
      latitude,
      longitude,
      day,
    };
    return this.driversServiceFacade.updateLocationFacade(driverPositionDto);
  }

  @MessagePattern('broadcast_driver')
  async handleReceivedBroadcast(
    @Payload() data: any,
    @Ctx() context: RmqContext,
    @User() driver: UserInfo,
  ) {
    // console.log('ID Driver: ', driver.id);
    console.log('Data Received: ', data);
    console.log('------------------------');
    // this.driversServiceFacade.handleReceivedBroadCastFacade(data);
    // this.rmqService.ack(context);
    // context.getChannel().ack(context.getMessage());
    // Acknowledge the message
    // context.getChannelRef().ack(context.getMessage());
  }
}
