import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin, AdminInfo } from './decorators/admin.decorator';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { AdminAuthGuard } from './guards/local-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/signup')
  signUpAdmin(
    @Body() signUpAdminDto: SignUpAdminDto,
  ): Promise<{ token: string }> {
    return this.adminService.signUp(signUpAdminDto);
  }
  @Post('/login')
  login(@Body() loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    return this.adminService.login(loginAdminDto);
  }

  @UseGuards(new AdminAuthGuard())
  @Get()
  getAllUser(@Admin() admin: AdminInfo) {
    console.log(admin);
    return this.adminService.getAll();
  }
}
