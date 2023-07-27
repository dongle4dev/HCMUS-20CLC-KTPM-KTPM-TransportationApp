import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from './admins.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { Admin } from './schema/admin.schema';

@Injectable()
export class AdminsServiceFacade {
  constructor(
    private readonly adminsService: AdminsService,
    private jwtService: JwtService,
  ) {}

  async signUpFacade(
    signUpAdminDto: SignUpAdminDto,
  ): Promise<{ token: string }> {
    const admin = await this.adminsService.signUp(signUpAdminDto);

    const token = this.jwtService.sign({ id: admin._id, role: admin.role });

    return { token };
  }

  async loginFacade(loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    const admin = await this.adminsService.login(loginAdminDto);

    const token = this.jwtService.sign({
      id: admin._id,
      role: admin.role,
    });

    return { token };
  }
  async getAllFacade(): Promise<Admin[]> {
    return this.adminsService.getAll();
  }
}
