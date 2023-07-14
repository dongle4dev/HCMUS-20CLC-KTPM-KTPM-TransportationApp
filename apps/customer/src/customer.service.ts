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

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private jwtService: JwtService,
  ) {}
  async signUp(
    signUpCustomerDto: SignUpCustomerDto,
  ): Promise<{ token: string }> {
    const { password } = signUpCustomerDto;

    const hashedPassword = await encodePassword(password);
    try {
      const customer = await this.customerModel.create({
        ...signUpCustomerDto,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({
        id: customer._id,
        role: customer.role,
      });

      return { token };
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginCustomerDto: LoginCustomerDto): Promise<{ token: string }> {
    const { email, password, phone } = loginCustomerDto;
    let customer;

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
    const token = this.jwtService.sign({
      id: customer._id,
      role: customer.role,
    });

    return { token };
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

    const customerUpdated = await this.customerModel.findByIdAndUpdate(
      { _id: id },
      {
        username,
        password: hashedPassword,
        gender,
        dob,
        address,
      },
      { new: true, runValidators: true },
    );

    return customerUpdated;
  }

  async deleteAccount(id: string): Promise<{ msg: string }> {
    await this.customerModel.findByIdAndRemove({ _id: id });
    return { msg: 'Deleted Account' };
  }

  async getAll(): Promise<Customer[]> {
    const customers = this.customerModel.find().exec();
    console.log(typeof customers);
    console.log(customers);
    return customers;
  }
}
