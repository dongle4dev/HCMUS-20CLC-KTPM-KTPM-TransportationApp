import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from 'y/common/auth/local-auth.guard';
import { User, UserInfo } from 'y/common/auth/user.decorator';
import { CustomersServiceFacade } from './customers.facade.service';
import { LocationBroadcastFromCustomerDto } from './dto/location-broadcast.dto';
import { LoginCustomerDto } from './dto/login.customer.dto';
import { SignUpCustomerDto } from './dto/signup.customer.dto';
import { UpdateCustomerDto } from './dto/update.customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersServiceFacade: CustomersServiceFacade,
  ) {}

  @Post('/signup')
  signUp(
    @Body() signUpCustomerDto: SignUpCustomerDto,
  ): Promise<{ token: string }> {
    return this.customersServiceFacade.signUpFacade(signUpCustomerDto);
  }
  @Post('/login')
  login(
    @Body() loginCustomerDto: LoginCustomerDto,
  ): Promise<{ token: string }> {
    return this.customersServiceFacade.loginFacade(loginCustomerDto);
  }

  @UseGuards(new UserAuthGuard())
  @Patch('/update')
  updateAccount(
    @Body() updateCustomerDto: UpdateCustomerDto,
    @User() customer: UserInfo,
  ) {
    return this.customersServiceFacade.updateAccountFacade(
      updateCustomerDto,
      customer.id,
    );
  }

  @UseGuards(new UserAuthGuard())
  @Delete('/delete')
  deleteAccount(@User() customer: UserInfo) {
    return this.customersServiceFacade.deleteAccountFacade(customer.id);
  }

  @UseGuards(new UserAuthGuard())
  @Get()
  getAllUser(@User() customer: UserInfo) {
    console.log(customer);
    return this.customersServiceFacade.getAllFacade();
  }

  @Delete('/delete-all')
  deleteAllCustomers() {
    return this.customersServiceFacade.deleteAllFacade();
  }

  @UseGuards(new UserAuthGuard())
  @Post('/demand-order')
  demandOrder(
    @Body() locationBroadcastFromCustomerDto: LocationBroadcastFromCustomerDto,
    @User() customer: UserInfo,
  ) {
    const { latitude, longitude, day, broadcastRadius } =
      locationBroadcastFromCustomerDto;
    const customerPositionDto = {
      id: customer.id,
      latitude,
      longitude,
      broadcastRadius,
      day,
    };
    console.log(customerPositionDto);
    return this.customersServiceFacade.demandOrderFacade(customerPositionDto);
  }
}
