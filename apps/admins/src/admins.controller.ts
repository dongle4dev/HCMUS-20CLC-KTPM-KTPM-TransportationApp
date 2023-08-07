import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { AdminsServiceFacade } from './admins.facade.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { UpdateStatusCustomerDto } from './dto/updateStatus.customer.dto';
import { UpdateStatusDriverDto } from './dto/updateStatus.driver.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsServiceFacade: AdminsServiceFacade) {}

  @Post('/signup')
  signUp(@Body() signUpAdminDto: SignUpAdminDto): Promise<{ token: string }> {
    return this.adminsServiceFacade.signUpFacade(signUpAdminDto);
  }
  @Post('/login')
  login(@Body() loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    return this.adminsServiceFacade.loginFacade(loginAdminDto);
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
  @Patch('/update-status/driver')
  updateStatusDriver(@Body() updateStatusDriverDto: UpdateStatusDriverDto) {
    return this.adminsServiceFacade.updateStatusDriverFacade(
      updateStatusDriverDto,
    );
  }
  @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() admin: UserInfo) {
    console.log(admin);
    return this.adminsServiceFacade.getAllFacade();
  }
}
