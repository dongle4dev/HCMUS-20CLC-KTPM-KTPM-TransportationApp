import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateStatusDriverDto } from 'apps/admins/src/dto/updateStatus.driver.dto';
import { CreateMessageDto } from 'apps/messages/src/dto/create.message.dto';
import { GetMessagesDto } from 'apps/messages/src/dto/get.messages.dto';
import { UpdateTripStatusDto } from 'apps/trips/src/dto/update-trip-status.dto';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { CalculatePriceTripsDto } from 'y/common/dto/calculate-price-trips.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { DriversService } from './drivers.service';
import { LoginDriverDto } from './dto/login.driver.dto';
import { SignUpDriverDto } from './dto/signup.driver.dto';
import { UpdateDriverDto } from './dto/update.driver.dto';

@Injectable()
export class DriversServiceFacade {
  constructor(
    private readonly driversService: DriversService,
    private jwtService: JwtService,
  ) { }

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

  async updateLocationFacade(driverPositionDto: DriverPositionDto) {
    return this.driversService.updateLocation(driverPositionDto);
  }

  async updateTripStatusFacade(updateTripStatusDto: UpdateTripStatusDto) {
    return this.driversService.updateTripStatus(updateTripStatusDto);
  }
  async getDriverTripsFacade(id: string) {
    return this.driversService.getDriverTrips(id);
  }
  async getRevenueFacade(id: string) {
    return this.driversService.getRevenue(id);
  }
  async getRevenueByTimeFacade(calculatePriceTripsDto: CalculatePriceTripsDto) {
    return this.driversService.getRevenueByTime(calculatePriceTripsDto);
  }
  async handleReceivedBroadCastFacade(data: any) {
    return this.driversService.handleReceivedBroadCast(data);
  }

  //CRUD Driver
  async getDriversFacade(): Promise<Driver[]> {
    return this.driversService.getDrivers();
  }
  async getNumberDriversFacade() {
    return this.driversService.getNumberDrivers();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingDriverFacade(
    updateStatusDriverDto: UpdateStatusDriverDto,
  ): Promise<Driver> {
    return this.driversService.updateStatusBlockingDriver(
      updateStatusDriverDto,
    );
  }

  async deleteDriverFacade(driverID: string) {
    return this.driversService.deleteDriver(driverID);
  }

  //Message
  async createMessageFacade(createMessageDto: CreateMessageDto) {
    return this.driversService.createMessage(createMessageDto);
  }
  async getMessagesWithCustomerFacade(getMessagesDto: GetMessagesDto) {
    return this.driversService.getMessagesWithCustomer(getMessagesDto);
  }
}
