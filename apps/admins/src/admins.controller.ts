import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { AdminsServiceFacade } from './admins.facade.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { UpdateStatusCustomerDto } from './dto/updateStatus.customer.dto';
import { UpdateStatusDriverDto } from './dto/updateStatus.driver.dto';
import { UpdateStatusHotlineDto } from './dto/updateStatus.hotline.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsServiceFacade: AdminsServiceFacade) {}

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
  @Patch('/update-status/driver')
  updateStatusDriver(@Body() updateStatusDriverDto: UpdateStatusDriverDto) {
    return this.adminsServiceFacade.updateStatusDriverFacade(
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
  @Patch('/update-status/customer')
  updateStatusCustomer(
    @Body() updateStatusCustomerDto: UpdateStatusCustomerDto,
  ) {
    console.log(updateStatusCustomerDto);
    return this.adminsServiceFacade.updateStatusCustomerFacade(
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
  @Patch('/update-status/hotline')
  updateStatusHotline(@Body() updateStatusHotlineDto: UpdateStatusHotlineDto) {
    return this.adminsServiceFacade.updateStatusHotlineFacade(
      updateStatusHotlineDto,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete/hotline')
  deleteHotline(@Body('id') id: string) {
    return this.adminsServiceFacade.deleteHotlineFacade(id);
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
}
