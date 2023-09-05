import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateMessageDto } from 'y/common/dto/message/dto/create.message.dto';
import { GetMessagesDto } from 'y/common/dto/message/dto/get.messages.dto';
import { CreateNotificationDto } from 'y/common/dto/notification/dto/create-notification.dto';

import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { DriversService } from './drivers.service';
import { LoginDriverDto } from '../../../libs/common/src/dto/driver/dto/login.driver.dto';
import { SignUpDriverDto } from '../../../libs/common/src/dto/driver/dto/signup.driver.dto';
import { UpdateDriverDto } from '../../../libs/common/src/dto/driver/dto/update.driver.dto';
import {
  CalculatePriceTripsDto,
  UpdateStatusDriverDto,
  UpdateTripStatusDto,
} from 'y/common';
import { DeleteMessagesDto } from 'y/common/dto/message/dto/delete.message.dto';
import { CreateVehicleDto } from 'y/common/dto/vehicle/dto/create.vehicle.dto';

@Injectable()
export class DriversServiceFacade {
  constructor(
    private readonly driversService: DriversService,
    private jwtService: JwtService,
  ) {}

  async createOTPFacade(phoneNumber: string) {
    const { otp, phone } = await this.driversService.createOTP(phoneNumber);
    const OTP_token = this.jwtService.sign({ otp, phone });
    return { OTP_token };
  }
  async signUpFacade(
    signUpDriverDto: SignUpDriverDto,
  ): Promise<{ token: string }> {
    const OTP_verify = this.jwtService.verify(signUpDriverDto.OTP_token);
    if (OTP_verify.otp === signUpDriverDto.otp) {
      if (OTP_verify.phone !== signUpDriverDto.phone) {
        throw new BadRequestException('Incorrect phone number');
      }
      const driver = await this.driversService.signUp(signUpDriverDto);
      const token = this.jwtService.sign({
        id: driver._id,
        role: driver.role,
      });

      return { token };
    } else {
      throw new BadRequestException('Invalid OTP');
    }
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

  async getInformationFacade(id: string) {
    return this.driversService.getInformation(id);
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
  async acceptTrip(updateTripStatus: any) {
    return this.driversService.acceptTrip(updateTripStatus);
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
  async deleteBothMessagesFacade(deleteMessagesDto: DeleteMessagesDto) {
    return this.driversService.deleteBothMessages(deleteMessagesDto);
  }

  //FEEDBACK
  async getDriverFeedBacksFacade(id: string) {
    return this.driversService.getDriverFeedBacks(id);
  }

  //NOTIFICATION
  async createNotificationFacade(createNotificationDto: CreateNotificationDto) {
    return this.driversService.createNotification(createNotificationDto);
  }

  //VEHICLE
  async registerVehicleFacade(createVehicleDto: CreateVehicleDto) {
    return this.driversService.registerVehicle(createVehicleDto);
  }

  async deleteDriverVehicleFacade(id: string) {
    return this.driversService.deleteDriverVehicle(id);
  }
  async getDriverVehicleFacade(id: string) {
    return this.driversService.getDriverVehicle(id);
  }
}
