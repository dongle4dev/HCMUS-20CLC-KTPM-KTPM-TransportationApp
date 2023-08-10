import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from 'y/common/auth/user.decorator';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { CustomersService } from './customers.service';
import { LoginCustomerDto } from './dto/login.customer.dto';
import { SignUpCustomerDto } from './dto/signup.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';

@Injectable()
export class CustomersServiceFacade {
  constructor(
    private readonly customersService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async signUpFacade(
    signUpCustomerDto: SignUpCustomerDto,
  ): Promise<{ token: string }> {
    const customer = await this.customersService.signUp(signUpCustomerDto);

    const token = this.jwtService.sign({
      id: customer._id,
      role: customer.role,
    });

    return { token };
  }

  async loginFacade(
    loginCustomerDto: LoginCustomerDto,
  ): Promise<{ token: string }> {
    const customer = await this.customersService.login(loginCustomerDto);

    const token = this.jwtService.sign({
      id: customer._id,
      role: customer.role,
    });

    return { token };
  }

  async updateAccountFacade(
    updateCustomerDto: UpdateCustomerDto,
    id: string,
  ): Promise<Customer> {
    return this.customersService.updateAccount(updateCustomerDto, id);
  }

  async deleteAccountFacade(id: string): Promise<{ msg: string }> {
    return this.customersService.deleteAccount(id);
  }
  async getAllFacade(): Promise<Customer[]> {
    return this.customersService.getAll();
  }

  async deleteAllFacade(): Promise<{ msg: string }> {
    return this.customersService.deleteAll();
  }

  async demandOrderFacade(customerPositionDto: CustomerPositionDto) {
    return this.customersService.demandOrder(customerPositionDto);
  }
}
