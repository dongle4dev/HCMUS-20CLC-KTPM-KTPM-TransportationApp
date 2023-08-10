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
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { VehiclesRepository } from 'y/common/database/vehicle/repository/vehicles.repository';
import { Vehicle } from 'y/common/database/vehicle/schema/vehicle.schema';
import { CreateHotlineDto } from './dto/create.hotline.dto';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { UpdateStatusCustomerDto } from './dto/updateStatus.customer.dto';
import { UpdateStatusDriverDto } from './dto/updateStatus.driver.dto';
import { UpdateStatusHotlineDto } from './dto/updateStatus.hotline.dto';

@Injectable()
export class AdminsService {
  constructor(
    // @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly adminRepository: AdminsRepository, // private jwtService: JwtService,
    private readonly customerRepository: CustomersRepository,
    private readonly driverRepository: DriversRepository,
    private readonly hotlineRepository: HotlinesRepository,
    private readonly vehicleRepository: VehiclesRepository,
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
  async getDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find({});
    return drivers;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusDriver(
    updateStatusDriverDto: UpdateStatusDriverDto,
  ): Promise<Driver> {
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

  async deleteDriver(driverID: string): Promise<{ msg: string }> {
    console.log(driverID);
    await this.driverRepository.delete({ _id: driverID });
    return { msg: `Delete driver with id ${driverID} successfully` };
  }

  //CRUD Customer
  async getCustomers(): Promise<Customer[]> {
    const customers = await this.customerRepository.find({});
    return customers;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusCustomer(
    updateStatusCustomerDto: UpdateStatusCustomerDto,
  ): Promise<Customer> {
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

  async deleteCustomer(customerID: string): Promise<{ msg: string }> {
    await this.customerRepository.delete({ _id: customerID });
    return { msg: `Delete customer with id ${customerID} successfully` };
  }

  //CRUD Hotline
  async getHotlines(): Promise<Hotline[]> {
    const hotlines = await this.hotlineRepository.find({});
    return hotlines;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusHotline(
    updateStatusHotlineDto: UpdateStatusHotlineDto,
  ): Promise<Hotline> {
    const { id, blocked } = updateStatusHotlineDto;

    const hotline = await this.hotlineRepository.findOneAndUpdate(
      { _id: id },
      { blocked },
    );
    if (!hotline) {
      throw new NotFoundException('Not Found hotline');
    }
    console.log(hotline);
    return hotline;
  }

  async deleteHotline(hotlineID: string): Promise<{ msg: string }> {
    await this.hotlineRepository.delete({ _id: hotlineID });
    return { msg: `Delete hotline with id ${hotlineID} successfully` };
  }

  async createHotline(createHotlineDto: CreateHotlineDto): Promise<Hotline> {
    const { password } = createHotlineDto;

    const hashedPassword = await encodePassword(password);
    try {
      const hotline = await this.hotlineRepository.create({
        ...createHotlineDto,
        password: hashedPassword,
      });

      return hotline;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
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
  async getVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.vehicleRepository.find({});
    return vehicles;
  }

  async deleteVehicle(vehicleID: string): Promise<{ msg: string }> {
    await this.vehicleRepository.delete({ _id: vehicleID });
    return { msg: `Delete vehicle with id ${vehicleID} successfully` };
  }

  async getAll(): Promise<Admin[]> {
    const admins = await this.adminRepository.find({});
    console.log(typeof admins);
    console.log(admins);
    return admins;
  }
}
