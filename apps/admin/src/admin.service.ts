import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { Admin } from './schema/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpAdminDto: SignUpAdminDto): Promise<{ token: string }> {
    const { password } = signUpAdminDto;

    const hashedPassword = await encodePassword(password);
    try {
      const admin = await this.adminModel.create({
        ...signUpAdminDto,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: admin._id, role: admin.role });

      return { token };
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    const { email, password } = loginAdminDto;

    const admin = await this.adminModel.findOne({ email });

    if (!admin) {
      throw new UnauthorizedException('Invalid credential');
    }
    const isPasswordMatched = await comparePassword(password, admin.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    const token = this.jwtService.sign({
      id: admin._id,
      role: admin.role,
    });

    return { token };
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
  async updateStatusDriver() {
    return null;
  }

  async deleteDriver() {
    return null;
  }

  //CRUD Customer
  async getCustomers() {
    return null;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusCustomer() {
    return null;
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
    const admins = this.adminModel.find().exec();
    console.log(typeof admins);
    console.log(admins);
    return admins;
  }
}
