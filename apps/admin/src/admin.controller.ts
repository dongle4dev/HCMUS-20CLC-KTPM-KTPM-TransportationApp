import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminServiceFacade } from './admin.facade.service';
import { AdminService } from './admin.service';
import { Admin, AdminInfo } from './decorators/admin.decorator';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { AdminAuthGuard } from './guards/local-auth.guard';

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

  @UseGuards(new AdminAuthGuard())
  @Get()
  getAllUser(@Admin() admin: AdminInfo) {
    console.log(admin);
    return this.adminServiceFacade.getAllFacade();
  }
}
