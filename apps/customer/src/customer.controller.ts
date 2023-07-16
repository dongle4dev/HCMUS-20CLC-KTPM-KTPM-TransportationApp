import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CustomerServiceFacade } from './customer.facade.service';
import { Customer, CustomerInfo } from './decorators/customer.decorator';
import { LoginCustomerDto } from './dto/login.customer.dto';
import { SignUpCustomerDto } from './dto/signup.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';
import { CustomerAuthGuard } from './guards/local-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerServiceFacade: CustomerServiceFacade) {}

  @Post('/signup')
  signUpCustomer(
    @Body() signUpCustomerDto: SignUpCustomerDto,
  ): Promise<{ token: string }> {
    return this.customerServiceFacade.signUpFacade(signUpCustomerDto);
  }
  @Post('/login')
  login(
    @Body() loginCustomerDto: LoginCustomerDto,
  ): Promise<{ token: string }> {
    return this.customerServiceFacade.loginFacade(loginCustomerDto);
  }

  @UseGuards(new CustomerAuthGuard())
  @Patch('/update')
  updateAccount(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Customer() customer: CustomerInfo,
  ) {
    return this.customerServiceFacade.updateAccountFacade(
      updateCustomerDto,
      customer.id,
    );
  }

  @UseGuards(new CustomerAuthGuard())
  @Delete('/delete')
  deleteAccount(@Customer() customer: CustomerInfo) {
    return this.customerServiceFacade.deleteAccountFacade(customer.id);
  }

  @UseGuards(new CustomerAuthGuard())
  @Get()
  getAllUser(@Customer() customer: CustomerInfo) {
    console.log(customer);
    return this.customerServiceFacade.getAllFacade();
  }
}
