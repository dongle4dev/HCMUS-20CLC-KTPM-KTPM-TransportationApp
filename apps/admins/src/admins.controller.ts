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
  LoginAdminDto,
  SignUpAdminDto,
  UpdateStatusCustomerDto,
  UpdateStatusDriverDto,
  UpdateStatusHotlineDto,
} from 'y/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CalculateTripRedisDto } from 'y/common/dto/admin/set-redis.dto';
import { CalculatePriceTripsDto } from 'y/common/dto/calculate-price-trips.dto';
import { CreateHotlineDto } from '../../../libs/common/src/dto/admin/create.hotline.dto';
import { AdminsServiceFacade } from './admins.facade.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsServiceFacade: AdminsServiceFacade) {}

  @Patch('/update-redis-calculate-trip')
  async setCalculateRedis(
    @Body() calculateTripRedisDto: CalculateTripRedisDto,
  ) {
    return this.adminsServiceFacade.setCalculateRedisFacade(
      calculateTripRedisDto,
    );
  }

  //ADMIN
  @Post('/signup')
  signUp(@Body() signUpAdminDto: SignUpAdminDto): Promise<{ token: string }> {
    return this.adminsServiceFacade.signUpFacade(signUpAdminDto);
  }
  @Post('/login')
  login(@Body() loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    return this.adminsServiceFacade.loginFacade(loginAdminDto);
  }

  @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() admin: UserInfo) {
    console.log(admin);
    return this.adminsServiceFacade.getAllFacade();
  }

  //CRUD DRIVER
  @UseGuards(new UserAuthGuard())
  @Get('/get-all/driver')
  getAllDrivers() {
    return this.adminsServiceFacade.getDriversFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-number/driver')
  getAllNumberDrivers() {
    return this.adminsServiceFacade.getNumberDriversFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update-status/driver')
  updateStatusDriver(@Body() updateStatusDriverDto: UpdateStatusDriverDto) {
    return this.adminsServiceFacade.updateStatusBlockingDriverFacade(
      updateStatusDriverDto,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete/driver')
  deleteDriver(@Body('id') id: string) {
    return this.adminsServiceFacade.deleteDriverFacade(id);
  }

  //CRUD CUSTOMER
  @UseGuards(new UserAuthGuard())
  @Get('/get-all/customer')
  getAllCustomers() {
    return this.adminsServiceFacade.getCustomersFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-number/customer')
  getAllNumberCustomers() {
    return this.adminsServiceFacade.getNumberCustomersFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update-status/customer')
  updateStatusCustomer(
    @Body() updateStatusCustomerDto: UpdateStatusCustomerDto,
  ) {
    console.log(updateStatusCustomerDto);
    return this.adminsServiceFacade.updateStatusBlockingCustomerFacade(
      updateStatusCustomerDto,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete/customer')
  deleteCustomer(@Body('id') id: string) {
    return this.adminsServiceFacade.deleteCustomerFacade(id);
  }

  //CRUD HOTLINE
  @UseGuards(new UserAuthGuard())
  @Get('/get-all/hotline')
  getAllHotlines() {
    return this.adminsServiceFacade.getHotlinesFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Get('/get-number/hotline')
  getAllNumberHotlines() {
    return this.adminsServiceFacade.getNumberHotlinesFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update-status/hotline')
  updateStatusHotline(@Body() updateStatusHotlineDto: UpdateStatusHotlineDto) {
    return this.adminsServiceFacade.updateStatusBlockingHotlineFacade(
      updateStatusHotlineDto,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete/hotline')
  deleteHotline(@Body('id') id: string) {
    return this.adminsServiceFacade.deleteHotlineFacade(id);
  }

  @UseGuards(new UserAuthGuard())
  @Post('/create-hotline')
  createHotline(@Body() createHotlineDto: CreateHotlineDto) {
    return this.adminsServiceFacade.createHotlineFacade(createHotlineDto);
  }

  //VEHICLE
  @UseGuards(new UserAuthGuard())
  @Get('/get-all/vehicle')
  getAllVehicles() {
    return this.adminsServiceFacade.getVehiclesFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete/vehicle')
  deleteVehicle(@Body('id') id: string) {
    return this.adminsServiceFacade.deleteVehicleFacade(id);
  }

  //TRIP
  @UseGuards(new UserAuthGuard())
  @Get('/get-all-trips')
  getAllTrips() {
    return this.adminsServiceFacade.getAllTripsFacade();
  }
  @UseGuards(new UserAuthGuard())
  @Get('/get-cancel-trips')
  getCancelTrips() {
    return this.adminsServiceFacade.getCancelTripsFacade();
  }
  @UseGuards(new UserAuthGuard())
  @Get('/get-finish-trips')
  getFinishTrips() {
    return this.adminsServiceFacade.getFinishTripsFacade();
  }
  @UseGuards(new UserAuthGuard())
  @Get('calculate-trips-by-time')
  calculateTripsByTime(@Body() calculatePriceTripsDto: CalculatePriceTripsDto) {
    return this.adminsServiceFacade.calculatePriceTripsByTimeFacade(
      calculatePriceTripsDto,
    );
  }
  @UseGuards(new UserAuthGuard())
  @Get('calculate-all-trips')
  calculateAllTrips() {
    return this.adminsServiceFacade.calculatePriceAllTripsFacade();
  }

  //FEEDBACK
  @UseGuards(new UserAuthGuard())
  @Get('get-all-feedbacks')
  getAllFeedBacks() {
    return this.adminsServiceFacade.getAllFeedBacksFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Delete('delete-feedback/:id')
  deleteFeedBack(@Param('id') id: string) {
    return this.adminsServiceFacade.deleteFeedBackFacade(id);
  }

  @UseGuards(new UserAuthGuard())
  @Delete('delete-all-feedbacks')
  deleteAllFeedBacks() {
    return this.adminsServiceFacade.deleteAllFeedBacksFacade();
  }

  //REPORT
  @UseGuards(new UserAuthGuard())
  @Get('get-all-reports')
  getAllReports() {
    return this.adminsServiceFacade.getAllReportsFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Delete('delete-all-reports')
  deleteAllReports() {
    return this.adminsServiceFacade.deleteAllReportsFacade();
  }
}
