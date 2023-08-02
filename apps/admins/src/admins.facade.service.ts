import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'y/common/database/admin/schema/admin.schema';
import { AdminsService } from './admins.service';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { UpdateStatusCustomerDto } from './dto/updateStatus.customer.dto';
import { UpdateStatusDriverDto } from './dto/updateStatus.driver.dto';

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
  async getDriversFacade() {
    return this.adminsService.getDrivers();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusDriverFacade(updateStatusDriverDto: UpdateStatusDriverDto) {
    return this.adminsService.updateStatusDriver(updateStatusDriverDto);
  }

  async deleteDriverFacade() {
    return this.adminsService.deleteDriver();
  }

  //CRUD Customer
  async getCustomersFacade() {
    return this.adminsService.getCustomers();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusCustomerFacade(
    updateStatusCustomerDto: UpdateStatusCustomerDto,
  ) {
    return this.adminsService.updateStatusCustomer(updateStatusCustomerDto);
  }

  async deleteCustomerFacade() {
    return this.adminsService.deleteCustomer();
  }

  //CRUD Hotline
  async getHotlinesFacade() {
    return this.adminsService.getHotlines();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusHotlineFacade() {
    return this.adminsService.updateStatusHotline();
  }

  async deleteHotlineFacade() {
    return this.adminsService.deleteHotline();
  }

  async createHotlineFacade() {
    return this.adminsService.createHotline();
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
  async getVehiclesFacade() {
    return this.adminsService.getVehicles();
  }

  async deleteVehicleFacade() {
    return this.adminsService.deleteVehicle();
  }

  async getAllFacade(): Promise<Admin[]> {
    return this.adminsService.getAll();
  }
}
