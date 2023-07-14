import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { roleParam } from 'utils/enum';
import { CustomerService } from './customer.service';
import { Customer, CustomerInfo } from './decorators/customer.decorator';
import { LoginCustomerDto } from './dto/login.customer.dto';
import { SignUpCustomerDto } from './dto/signup.customer.dto';
import { CustomerAuthGuard } from './guards/local-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/signup')
  signUpCustomer(
    @Body() signUpCustomerDto: SignUpCustomerDto,
  ): Promise<{ token: string }> {
    return this.customerService.signUp(signUpCustomerDto);
  }
  @Post('/login')
  login(
    @Body() loginCustomerDto: LoginCustomerDto,
  ): Promise<{ token: string }> {
    return this.customerService.login(loginCustomerDto);
  }

  @UseGuards(new CustomerAuthGuard())
  @Get()
  getAllUser(@Customer() customer: CustomerInfo) {
    console.log(customer);
    return this.customerService.getAll();
  }
}
