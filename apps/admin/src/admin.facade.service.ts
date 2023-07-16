import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { Admin } from './schema/admin.schema';

@Injectable()
export class AdminServiceFacade {
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async signUpFacade(
    signUpAdminDto: SignUpAdminDto,
  ): Promise<{ token: string }> {
    const admin = await this.adminService.signUp(signUpAdminDto);

    const token = this.jwtService.sign({ id: admin._id, role: admin.role });

    return { token };
  }

  async loginFacade(loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    const admin = await this.adminService.login(loginAdminDto);

    const token = this.jwtService.sign({
      id: admin._id,
      role: admin.role,
    });

    return { token };
  }
  async getAllFacade(): Promise<Admin[]> {
    return this.adminService.getAll();
  }
}
