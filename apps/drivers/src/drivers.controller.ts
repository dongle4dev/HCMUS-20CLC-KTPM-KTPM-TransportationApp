import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
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
import { CreateMessageDto } from 'y/common/dto/message/dto/create.message.dto';
import { CreateNotificationDto } from 'y/common/dto/notification/dto/create-notification.dto';

import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CalculatePriceTripsDto } from 'y/common/dto/calculate-price-trips.dto';
import { RmqService } from 'y/common/rmq/rmq.service';
import { DriversServiceFacade } from './drivers.facade.service';
import { LocationDto } from '../../../libs/common/src/dto/driver/dto/location.dto';
import { LoginDriverDto } from '../../../libs/common/src/dto/driver/dto/login.driver.dto';
import { SignUpDriverDto } from '../../../libs/common/src/dto/driver/dto/signup.driver.dto';
import { UpdateDriverDto } from '../../../libs/common/src/dto/driver/dto/update.driver.dto';
import { CreateTripDto, UpdateTripStatusDto } from 'y/common';
import { DeleteMessagesDto } from 'y/common/dto/message/dto/delete.message.dto';
import { CreateVehicleDto } from 'y/common/dto/vehicle/dto/create.vehicle.dto';

@Controller('/drivers')
export class DriversController {
  constructor(
    private readonly driversServiceFacade: DriversServiceFacade,
    private readonly rmqService: RmqService, // @Inject('DEMAND_SERVICE') private demandService: ClientProxy,
  ) {}

  @Post('/create-otp')
  createOtp(@Body('phone') phone: string) {
    return this.driversServiceFacade.createOTPFacade(phone);
  }
  @Post('/signup')
  signUp(@Body() signUpDriverDto: SignUpDriverDto): Promise<{ token: string }> {
    return this.driversServiceFacade.signUpFacade(signUpDriverDto);
  }
  @Post('/login')
  login(@Body() loginDriverDto: LoginDriverDto): Promise<{ token: string }> {
    return this.driversServiceFacade.loginFacade(loginDriverDto);
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-infor')
  getInformation(@User() driver: UserInfo) {
    return this.driversServiceFacade.getInformationFacade(driver.id);
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

  @Post('/accept')
  @UseGuards(new UserAuthGuard())
  acceptTrip(@Param() trip: CreateTripDto) {
    return this.driversServiceFacade.acceptTrip(trip);
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

  @UseGuards(new UserAuthGuard())
  @Delete('/delete-both-messages-driver-customer/:customerID')
  async deleteBothMessages(
    @Param('customerID') customerID: string,
    @User() driver: UserInfo,
  ) {
    const deleteMessagesDto = {
      customer: customerID,
      driver: driver.id,
    };
    return this.driversServiceFacade.deleteBothMessagesFacade(
      deleteMessagesDto,
    );
  }

  //FEEDBACK
  @UseGuards(new UserAuthGuard())
  @Get('/get-feedbacks')
  async getFeedBacks(@User() driver: UserInfo) {
    return this.driversServiceFacade.getDriverFeedBacksFacade(driver.id);
  }

  //NOTIFICATION
  @UseGuards(new UserAuthGuard())
  @Post('/create-notification')
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @User() driver: UserInfo,
  ) {
    createNotificationDto.driver = driver.id;
    return this.driversServiceFacade.createNotificationFacade(
      createNotificationDto,
    );
  }
  //VEHICLE
  @UseGuards(new UserAuthGuard())
  @Post('/register-vehicle')
  async registerVehicle(
    @User() driver: UserInfo,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    createVehicleDto.driver = driver.id;
    return this.driversServiceFacade.registerVehicleFacade(createVehicleDto);
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete-vehicle')
  async deleteDriverVehicle(@User() driver: UserInfo) {
    return this.driversServiceFacade.deleteDriverVehicleFacade(driver.id);
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-vehicle')
  async getDriverVehicle(@User() driver: UserInfo) {
    return this.driversServiceFacade.getDriverVehicleFacade(driver.id);
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
