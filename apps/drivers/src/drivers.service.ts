import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { SignUpDriverDto } from './dto/signup.driver.dto';
import { LoginDriverDto } from './dto/login.driver.dto';
import { UpdateDriverDto } from './dto/update.driver.dto';

@Injectable()
export class DriversService {
  constructor(
    private readonly driverRepository: DriversRepository, // private jwtService: JwtService,
  ) {}
  async signUp(signUpDriverDto: SignUpDriverDto): Promise<Driver> {
    const { password } = signUpDriverDto;

    const hashedPassword = await encodePassword(password);
    try {
      const driver = await this.driverRepository.create({
        ...signUpDriverDto,
        password: hashedPassword,
      });

      return driver;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginDriverDto: LoginDriverDto): Promise<Driver> {
    const { email, password, phone } = loginDriverDto;
    let driver: Driver;

    if (email) {
      driver = await this.driverRepository.findOne({ email });
    } else {
      driver = await this.driverRepository.findOne({ phone });
    }

    if (driver.blocked) {
      throw new UnauthorizedException('User has been blocked');
    }
    if (!driver) {
      throw new UnauthorizedException('Invalid credential');
    }
    const isPasswordMatched = await comparePassword(password, driver.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return driver;
  }

  async updateAccount(
    updateDriverDto: UpdateDriverDto,
    id: string,
  ): Promise<Driver> {
    const { username, password, gender, address, dob, vehicleId } =
      updateDriverDto;

    if (!username && !password && !gender && !address && !dob && !vehicleId) {
      throw new BadRequestException('Need to input at least 1 information');
    }
    const hashedPassword = await encodePassword(password);

    const driverUpdated = await this.driverRepository.findOneAndUpdate(
      { _id: id },
      {
        username,
        password: hashedPassword,
        gender,
        dob,
        address,
      },
    );

    return driverUpdated;
  }

  async deleteAccount(id: string): Promise<{ msg: string }> {
    await this.driverRepository.delete({ _id: id });
    return { msg: 'Deleted Account' };
  }

  //Quên mật khẩu
  async forgotPassword() {
    return null;
  }

  //Thông báo đơn (thông tin khách hàng, địa chỉ)
  async getOrderInformation() {
    return null;
  }

  //Xác nhận đơn( Đơn thường hay Đơn Vip)
  async acceptOrder() {
    return null;
  }

  //Huỷ đơn
  async cancelOrder() {
    return null;
  }

  //Thông báo tin nhắn tiền vào tài khoản
  async receiveNotification() {
    return null;
  }

  // Lấy tất cả Thông báo
  async getAllNotifications() {
    return null;
  }

  //Gửi tin nhắn
  async sendMessage() {
    return null;
  }

  //Gọi điện
  async calling() {
    return null;
  }

  // xem lịch sử đơn hàng ( có feeedback đơn hàng)
  async getOrders() {
    return null;
  }

  async getAll(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find({});
    return drivers;
  }

  async deleteAll(): Promise<{ msg: string }> {
    await this.driverRepository.deleteMany({});
    return { msg: 'Deleted All Drivers' };
  }
}
