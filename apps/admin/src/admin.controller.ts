import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { AdminServiceFacade } from './admin.facade.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminServiceFacade: AdminServiceFacade) {}

  @Post('/signup')
  signUpAdmin(
    @Body() signUpAdminDto: SignUpAdminDto,
  ): Promise<{ token: string }> {
    return this.adminServiceFacade.signUpFacade(signUpAdminDto);
  }
  @Post('/login')
  login(@Body() loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    return this.adminServiceFacade.loginFacade(loginAdminDto);
  }

  @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() admin: UserInfo) {
    console.log(admin);
    return this.adminServiceFacade.getAllFacade();
  }
}
