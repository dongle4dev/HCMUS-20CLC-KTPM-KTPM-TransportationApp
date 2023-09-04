import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginAdminDto,
  SignUpAdminDto,
  UpdateStatusCustomerDto,
  UpdateStatusDriverDto,
  UpdateStatusHotlineDto,
} from 'y/common';
import { Admin } from 'y/common/database/admin/schema/admin.schema';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { Vehicle } from 'y/common/database/vehicle/schema/vehicle.schema';
import { CalculatePriceTripsDto } from 'y/common/dto/calculate-price-trips.dto';
import { CreateHotlineDto } from '../../../libs/common/src/dto/admin/create.hotline.dto';
import { AdminsService } from './admins.service';

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

  // Quên mật khẩu
  async forgotPasswordFacade() {
    return this.adminsService.forgotPassword();
  }

  //CRUD Driver
  async getDriversFacade(): Promise<Driver[]> {
    return this.adminsService.getDrivers();
  }
  async getNumberDriversFacade() {
    return this.adminsService.getNumberDrivers();
  }
  // Mở hoặc khoá tài khoản
  async updateStatusBlockingDriverFacade(
    updateStatusDriverDto: UpdateStatusDriverDto,
  ): Promise<Driver> {
    return this.adminsService.updateStatusBlockingDriver(updateStatusDriverDto);
  }

  async deleteDriverFacade(driverID: string) {
    return this.adminsService.deleteDriver(driverID);
  }

  //CRUD Customer
  async getCustomersFacade(): Promise<Customer[]> {
    return this.adminsService.getCustomers();
  }

  async getNumberCustomersFacade() {
    return this.adminsService.getNumberCustomers();
  }
  // Mở hoặc khoá tài khoản
  async updateStatusBlockingCustomerFacade(
    updateStatusCustomerDto: UpdateStatusCustomerDto,
  ): Promise<Customer> {
    return this.adminsService.updateStatusBlockingCustomer(
      updateStatusCustomerDto,
    );
  }

  async deleteCustomerFacade(customerID: string) {
    return this.adminsService.deleteCustomer(customerID);
  }

  //CRUD Hotline
  async getHotlinesFacade(): Promise<Hotline[]> {
    return this.adminsService.getHotlines();
  }

  async getNumberHotlinesFacade() {
    return this.adminsService.getNumberHotlines();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingHotlineFacade(
    updateStatusHotlineDto: UpdateStatusHotlineDto,
  ): Promise<Hotline> {
    return this.adminsService.updateStatusBlockingHotline(
      updateStatusHotlineDto,
    );
  }

  async deleteHotlineFacade(hotlineID: string) {
    return this.adminsService.deleteHotline(hotlineID);
  }

  async createHotlineFacade(
    createHotlineDto: CreateHotlineDto,
  ): Promise<Hotline> {
    return this.adminsService.createHotline(createHotlineDto);
  }

  // Quản lý đơn hàng
  //Xem doanh thu ngày, tháng, năm/theo driver, loại xe,...
  async getRevenueFacade() {
    return this.adminsService.getRevenue();
  }

  async getOrdersFacade() {
    return this.adminsService.getOrders();
  }

  async updateOrderFacade() {
    return this.adminsService.updateOrder();
  }

  async deleteOrderFacade() {
    return this.adminsService.deleteOrder();
  }

  //Xem report, xoá report, phản hồi report
  async getReportsFacade() {
    return this.adminsService.getReports();
  }

  async responseReportFacade() {
    return this.adminsService.responseReport();
  }

  async deleteReportFacade() {
    return this.adminsService.deleteReport();
  }

  // xem Vehicle, xoá Vehicle
  async getVehiclesFacade(): Promise<Vehicle[]> {
    return this.adminsService.getVehicles();
  }

  async deleteVehicleFacade(vehicleID: string) {
    return this.adminsService.deleteVehicle(vehicleID);
  }

  async getAllFacade(): Promise<Admin[]> {
    return this.adminsService.getAll();
  }

  async getAllTripsFacade() {
    return this.adminsService.getAllTrips();
  }

  async getCancelTripsFacade() {
    return this.adminsService.getCancelTrips();
  }

  async getFinishTripsFacade() {
    return this.adminsService.getFinishTrips();
  }

  async calculatePriceTripsByTimeFacade(
    calculatePriceTripsDto: CalculatePriceTripsDto,
  ) {
    return this.adminsService.calculatePriceTripsByTime(calculatePriceTripsDto);
  }

  async calculatePriceAllTripsFacade() {
    return this.adminsService.calculatePriceAllTrips();
  }

  //FEEDBACK
  async getAllFeedBacksFacade() {
    return this.adminsService.getAllFeedBacks();
  }
  async deleteFeedBackFacade(id: string) {
    return this.adminsService.deleteFeedBack(id);
  }
  async deleteAllFeedBacksFacade() {
    return this.adminsService.deleteAllFeedBacks();
  }
}
