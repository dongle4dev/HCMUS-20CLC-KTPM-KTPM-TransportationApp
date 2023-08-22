import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
import { CreateMessageDto } from 'apps/messages/src/dto/create.message.dto';
import { UpdateTripStatusDto } from 'apps/trips/src/dto/update-trip-status.dto';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CalculatePriceTripsDto } from 'y/common/dto/calculate-price-trips.dto';
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
  ) { }

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

  @Patch('/update-trip-status')
  updateTripStatus(@Body() updateTripStatusDto: UpdateTripStatusDto) {
    return this.driversServiceFacade.updateTripStatusFacade(
      updateTripStatusDto,
    );
  }

  //TRIP
  @Get('/get-trips')
  @UseGuards(new UserAuthGuard())
  getDriverTrips(@User() driver: UserInfo) {
    return this.driversServiceFacade.getDriverTripsFacade(driver.id);
  }

  @Get('/get-revenue')
  @UseGuards(new UserAuthGuard())
  getRevenue(@User() driver: UserInfo) {
    return this.driversServiceFacade.getRevenueFacade(driver.id);
  }

  @Get('/get-revenue-by-time')
  @UseGuards(new UserAuthGuard())
  getRevenueByTime(
    @Body() calculatePriceTripsDto: CalculatePriceTripsDto,
    @User() driver: UserInfo,
  ) {
    calculatePriceTripsDto.id_user = driver.id;
    return this.driversServiceFacade.getRevenueByTimeFacade(
      calculatePriceTripsDto,
    );
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

  @EventPattern('broadcast_driver')
  async handleReceivedBroadcast(
    @Payload() data: any,
    @Ctx() context: RmqContext,
    // @User() driver: UserInfo,
  ) {
    // console.log('ID Driver: ', driver.id);
    this.driversServiceFacade.handleReceivedBroadCastFacade(data);
    this.rmqService.ack(context);
    // context.getChannel().ack(context.getMessage());
    // Acknowledge the message
    // context.getChannelRef().ack(context.getMessage());
    // this.rmqService.ack(context);
  }

  //MESSAGE
  @UseGuards(new UserAuthGuard())
  @Post('/create-message')
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @User() driver: UserInfo,
  ) {
    createMessageDto.driver_send = driver.id;
    return this.driversServiceFacade.createMessageFacade(createMessageDto);
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-messages-customer/:customerID')
  async getMessagesWithCustomer(
    @Param('customerID') customerID: string,
    @User() driver: UserInfo,
  ) {
    const getMessagesDto = {
      driver: driver.id,
      customer: customerID,
    };
    return this.driversServiceFacade.getMessagesWithCustomerFacade(
      getMessagesDto,
    );
  }

  @MessagePattern({ cmd: 'get_drivers_from_admin' })
  getDrivers(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.driversServiceFacade.getDriversFacade();
  }

  @MessagePattern({ cmd: 'get_number_drivers_from_admin' })
  getNumberDrivers(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.driversServiceFacade.getNumberDriversFacade();
  }

  @MessagePattern({ cmd: 'update_driver_from_admin' })
  updateStatusBlockingDriver(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);
    return this.driversServiceFacade.updateStatusBlockingDriverFacade(
      data.updateStatusDriverDto,
    );
  }

  @EventPattern('delete_driver_from_admin')
  deleteDriver(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);
    return this.driversServiceFacade.deleteDriverFacade(data.id);
  }

  //MESSAGE
  @EventPattern('send_message_from_customer')
  handleReceiveMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log(data);
    this.rmqService.ack(context);
  }
}
