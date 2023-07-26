import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { AdminsServiceFacade } from './admins.facade.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsServiceFacade: AdminsServiceFacade) {}

  @Post('/signup')
  signUpAdmin(
    @Body() signUpAdminDto: SignUpAdminDto,
  ): Promise<{ token: string }> {
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
}
