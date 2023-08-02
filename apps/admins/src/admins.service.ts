import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { AdminsRepository } from 'y/common/database/admin/repository/admins.repository';
import { Admin } from 'y/common/database/admin/schema/admin.schema';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { UpdateStatusCustomerDto } from './dto/updateStatus.customer.dto';
import { UpdateStatusDriverDto } from './dto/updateStatus.driver.dto';

@Injectable()
export class AdminsService {
  constructor(
    // @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly adminRepository: AdminsRepository, // private jwtService: JwtService,
    private readonly customerRepository: CustomersRepository,
    private readonly driverRepository: DriversRepository,
  ) {}
  async signUp(request: SignUpAdminDto): Promise<Admin> {
    const { password } = request;

    const hashedPassword = await encodePassword(password);
    try {
      const admin = await this.adminRepository.create({
        ...request,
        password: hashedPassword,
      });
      return admin;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      console.log(e);
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<Admin> {
    const { email, password } = loginAdminDto;
    const admin = await this.adminRepository.findOne({ email });

    if (!admin) {
      throw new UnauthorizedException('Invalid credential');
    }
    const isPasswordMatched = await comparePassword(password, admin.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return admin;
  }

  // Quên mật khẩu
  async forgotPassword() {
    return null;
  }

  //CRUD Driver
  async getDrivers() {
    return null;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusDriver(updateStatusDriverDto: UpdateStatusDriverDto) {
    const { id, blocked } = updateStatusDriverDto;

    const driver = await this.driverRepository.findOneAndUpdate(
      { _id: id },
      { blocked },
    );

    if (!driver) {
      throw new NotFoundException('Not Found driver');
    }
    return driver;
  }

  async deleteDriver() {
    return null;
  }

  //CRUD Customer
  async getCustomers() {
    return null;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusCustomer(updateStatusCustomerDto: UpdateStatusCustomerDto) {
    const { id, blocked } = updateStatusCustomerDto;

    const customer = await this.customerRepository.findOneAndUpdate(
      { _id: id },
      { blocked },
    );
    if (!customer) {
      throw new NotFoundException('Not Found customer');
    }
    console.log(customer);
    return customer;
  }

  async deleteCustomer() {
    return null;
  }

  //CRUD Hotline
  async getHotlines() {
    return null;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusHotline() {
    return null;
  }

  async deleteHotline() {
    return null;
  }

  async createHotline() {
    return null;
  }

  // Quản lý đơn hàng
  //Xem doanh thu ngày, tháng, năm/theo driver, loại xe,...
  async getRevenue() {
    return null;
  }

  async getOrders() {
    return null;
  }

  async updateOrder() {
    return null;
  }

  async deleteOrder() {
    return null;
  }

  //Xem report, xoá report, phản hồi report
  async getReports() {
    return null;
  }

  async responseReport() {
    return null;
  }

  async deleteReport() {
    return null;
  }

  // xem Vehicle, xoá Vehicle
  async getVehicles() {
    return null;
  }

  async deleteVehicle() {
    return null;
  }

  async getAll(): Promise<Admin[]> {
    const admins = await this.adminRepository.find({});
    console.log(typeof admins);
    console.log(admins);
    return admins;
  }
}
