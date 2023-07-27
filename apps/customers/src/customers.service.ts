import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './schema/customer.schema';
import { Model } from 'mongoose';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { SignUpCustomerDto } from './dto/signup.customer.dto';
import { LoginCustomerDto } from './dto/login.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';
import { CustomersRepository } from './customers.repository';

@Injectable()
export class CustomersService {
  constructor(
    // @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private readonly customerModel: CustomersRepository, // private jwtService: JwtService,
  ) {}
  async signUp(signUpCustomerDto: SignUpCustomerDto): Promise<Customer> {
    const { password } = signUpCustomerDto;

    const hashedPassword = await encodePassword(password);
    try {
      const customer = await this.customerModel.create({
        ...signUpCustomerDto,
        password: hashedPassword,
      });

      return customer;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginCustomerDto: LoginCustomerDto): Promise<Customer> {
    const { email, password, phone } = loginCustomerDto;
    let customer: Customer;

    if (email) {
      customer = await this.customerModel.findOne({ email });
    } else {
      customer = await this.customerModel.findOne({ phone });
    }

    if (!customer) {
      throw new UnauthorizedException('Invalid credential');
    }
    const isPasswordMatched = await comparePassword(
      password,
      customer.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return customer;
  }

  async updateAccount(
    updateCustomerDto: UpdateCustomerDto,
    id: string,
  ): Promise<Customer> {
    const { username, password, gender, address, dob } = updateCustomerDto;

    if (!username && !password && !gender && !address && !dob) {
      throw new BadRequestException('Need to input at least 1 information');
    }
    const hashedPassword = await encodePassword(password);

    const customerUpdated = await this.customerModel.findOneAndUpdate(
      { _id: id },
      {
        username,
        password: hashedPassword,
        gender,
        dob,
        address,
      },
    );

    return customerUpdated;
  }

  async deleteAccount(id: string): Promise<{ msg: string }> {
    await this.customerModel.delete({ _id: id });
    return { msg: 'Deleted Account' };
  }

  //Quên mật khẩu
  async forgotPassword() {
    return null;
  }

  //Đặt xe
  async bookingRide() {
    return null;
  }

  //Huỷ đơn đặt
  async cancelRide() {
    return null;
  }

  //Theo dõi lộ trình của chuyến xe
  async getRideInfor() {
    return null;
  }

  //Thông báo trạng thái đơn đặt xe
  async getAllNotifications() {
    return null;
  }

  async getNotification() {
    return null;
  }

  // Chế độ hẹn giờ (VIP)
  async alertMode() {
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

  //Xem thông tin tài xế
  async getDriverInfor() {
    return null;
  }

  //Gửi feedback: mấy *, nội dung
  async feedbackRide() {
    return null;
  }

  //Report tài xế
  async reportDriver() {
    return null;
  }

  async getAll(): Promise<Customer[]> {
    const customers = this.customerModel.find({});
    console.log(typeof customers);
    console.log(customers);
    return customers;
  }
}
