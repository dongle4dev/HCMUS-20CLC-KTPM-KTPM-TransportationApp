import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreateMessageDto } from 'apps/messages/src/dto/create.message.dto';
import { CreateTripDto } from 'apps/trips/src/dto/create-trip.dto';
import { UpdateTripDto } from 'apps/trips/src/dto/update-trip.dto';
import { RmqService } from 'y/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { CustomersServiceFacade } from './customers.facade.service';
import { LocationBroadcastFromCustomerDto } from './dto/location-broadcast.dto';
import { LoginCustomerDto } from './dto/login.customer.dto';
import { SignUpCustomerDto } from './dto/signup.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersServiceFacade: CustomersServiceFacade,
    private readonly rmqService: RmqService,
  ) {}

  @Post('/signup')
  signUp(
    @Body() signUpCustomerDto: SignUpCustomerDto,
  ): Promise<{ token: string }> {
    return this.customersServiceFacade.signUpFacade(signUpCustomerDto);
  }
  @Post('/login')
  login(
    @Body() loginCustomerDto: LoginCustomerDto,
  ): Promise<{ token: string }> {
    return this.customersServiceFacade.loginFacade(loginCustomerDto);
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update')
  updateAccount(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @User() customer: UserInfo,
  ) {
    return this.customersServiceFacade.updateAccountFacade(
      updateCustomerDto,
      customer.id,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete')
  deleteAccount(@User() customer: UserInfo) {
    return this.customersServiceFacade.deleteAccountFacade(customer.id);
  }

  // @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() customer: UserInfo) {
    console.log(customer);
    return this.customersServiceFacade.getAllFacade();
  }

  @Delete('/delete-all')
  deleteAllCustomers() {
    return this.customersServiceFacade.deleteAllFacade();
  }

  //TRIP
  @UseGuards(new UserAuthGuard())
  @Post('/broadcast-driver')
  async hotlineBroadCastToDriver(
    @Body() locationBroadcastFromCustomerDto: LocationBroadcastFromCustomerDto,
    @User() customer: UserInfo,
  ) {
    const { phone, latitude, longitude, day, broadcastRadius, arrivalAddress } =
      locationBroadcastFromCustomerDto;
    const customerPositionDto = {
      customer: customer.id,
      phone,
      latitude,
      longitude,
      broadcastRadius,
      arrivalAddress,
      day,
    };
    console.log(customerPositionDto);
    return this.customersServiceFacade.broadCastToDriversFacade(
      customerPositionDto,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Post('/create-trip')
  async createTrip(
    @Body() createTripDto: CreateTripDto,
    @User() customer: UserInfo,
  ) {
    createTripDto.customer = customer.id;
    return this.customersServiceFacade.createTripFacade(createTripDto);
  }
  @Patch('/update-trip-location')
  async updateTrip(@Body() updateTripDto: UpdateTripDto) {
    return this.customersServiceFacade.updateTripFacade(updateTripDto);
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-all-trips')
  async getAllCustomerTrips(@User() customer: UserInfo) {
    return this.customersServiceFacade.getAllTripsFacade(customer.id);
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/cancel-trip/:id')
  async cancelTrip(@Param('id') id: string, @User() customer: UserInfo) {
    const tripInfo = {
      id,
      customer: customer.id,
    };
    return this.customersServiceFacade.cancelTripFacade(tripInfo);
  }

  //MESSAGE
  @UseGuards(new UserAuthGuard())
  @Post('/create-message')
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @User() customer: UserInfo,
  ) {
    createMessageDto.customer_send = customer.id;
    return this.customersServiceFacade.createMessageFacade(createMessageDto);
  }
  @UseGuards(new UserAuthGuard())
  @Get('/get-messages-driver/:driverID')
  async getMessagesWithDriver(
    @Param('driverID') driverID: string,
    @User() customer: UserInfo,
  ) {
    const getMessagesDto = {
      customer: customer.id,
      driver: driverID,
    };
    return this.customersServiceFacade.getMessagesWithDriverFacade(
      getMessagesDto,
    );
  }

  @MessagePattern({ cmd: 'get_customers_from_admin' })
  getCustomers(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.customersServiceFacade.getCustomersFacade();
  }

  @MessagePattern({ cmd: 'get_number_customers_from_admin' })
  getNumberCustomers(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.customersServiceFacade.getNumberCustomersFacade();
  }

  @MessagePattern({ cmd: 'update_customer_from_admin' })
  updateStatusBlockingCustomer(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.customersServiceFacade.updateStatusBlockingCustomerFacade(
      data.updateStatusCustomerDto,
    );
  }

  @EventPattern('delete_customer_from_admin')
  deleteCustomer(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.customersServiceFacade.deleteCustomerFacade(data.id);
  }
}
