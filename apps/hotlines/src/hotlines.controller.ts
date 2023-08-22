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
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateTripDto, UpdateTripDto, LoginHotlineDto, SignUpHotlineDto, UpdateTripLocationDto, UpdateHotlineDto } from 'y/common';
import { RmqService } from 'y/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { LocationBroadcastFromHotlineDto } from '../../../libs/common/src/dto/location-broadcast.hotline.dto';
import { HotlinesServiceFacade } from './hotlines.facade.service';
import { HotlinesService } from './hotlines.service';

@Controller('hotlines')
export class HotlinesController {
  constructor(
    private readonly hotlinesServiceFacade: HotlinesServiceFacade,
    private readonly hotlinesService: HotlinesService,
    private readonly rmqService: RmqService,
  ) { }

  @Post('/trips')
  async createTrip(@Body() createTripDto: CreateTripDto) {
    return this.hotlinesService.createTrip(createTripDto);
  }

  @Get('/trips')
  async getAllTrip() {
    return this.hotlinesService.getAllTrip();
  }

  @Get('/trips-customer-phone/:phone')
  async getAllTripsByPhoneNumber(@Param('phone') phone: string) {
    return this.hotlinesService.getAllTripByPhoneNumber(phone);
  }

  @Patch('/update-trip-location')
  async updateTrip(@Body() updateTripDto: UpdateTripDto) {
    return this.hotlinesService.updateTrip(updateTripDto);
  }

  @Post('/broadcast-driver')
  async hotlineBroadCastToDriver(
    @Body() customerPositionDto: CustomerPositionDto,
  ) {
    return this.hotlinesService.broadCastToDrivers(customerPositionDto);
  }

  @MessagePattern({ cmd: 'get_hotlines_from_admin' })
  getHotlines(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.hotlinesServiceFacade.getHotlinesFacade();
  }

  @MessagePattern({ cmd: 'get_number_hotlines_from_admin' })
  getNumberHotlines(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.hotlinesServiceFacade.getNumberHotlinesFacade();
  }

  @MessagePattern({ cmd: 'update_hotline_from_admin' })
  updateStatusBlockingHotline(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.hotlinesServiceFacade.updateStatusBlockingHotlineFacade(
      data.updateStatusHotlineDto,
    );
  }

  @MessagePattern({ cmd: 'create_hotline_from_admin' })
  createHotline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.hotlinesServiceFacade.createHotlineFacade(
      data.createHotlineDto,
    );
  }
  @EventPattern('delete_hotline_from_admin')
  deleteHotline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.hotlinesService.deleteHotline(data.id);
  }

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

  @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() hotline: UserInfo) {
    console.log(hotline);
    return this.hotlinesServiceFacade.getAllFacade();
  }

  @Delete('/delete-all')
  deleteAllHotlines() {
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
}
