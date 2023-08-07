import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { DriversService } from './drivers.service';
import { LoginDriverDto } from './dto/login.driver.dto';
import { SignUpDriverDto } from './dto/signup.driver.dto';
import { UpdateDriverDto } from './dto/update.driver.dto';

@Injectable()
export class DriversServiceFacade {
  constructor(
    private readonly driversService: DriversService,
    private jwtService: JwtService,
  ) {}

  async signUpFacade(
    signUpDriverDto: SignUpDriverDto,
  ): Promise<{ token: string }> {
    const driver = await this.driversService.signUp(signUpDriverDto);

    const token = this.jwtService.sign({
      id: driver._id,
      role: driver.role,
    });

    return { token };
  }

  async loginFacade(
    loginDriverDto: LoginDriverDto,
  ): Promise<{ token: string }> {
    const driver = await this.driversService.login(loginDriverDto);

    const token = this.jwtService.sign({
      id: driver._id,
      role: driver.role,
    });

    return { token };
  }

  async updateAccountFacade(
    updateDriverDto: UpdateDriverDto,
    id: string,
  ): Promise<Driver> {
    return this.driversService.updateAccount(updateDriverDto, id);
  }

  async deleteAccountFacade(id: string): Promise<{ msg: string }> {
    return this.driversService.deleteAccount(id);
  }
  async getAllFacade(): Promise<Driver[]> {
    return this.driversService.getAll();
  }

  async deleteAllFacade(): Promise<{ msg: string }> {
    return this.driversService.deleteAll();
  }
}
