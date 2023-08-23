import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateFeedBackDto } from 'y/common/dto/feedback/dto/create-feedback.dto';
import { CreateMessageDto } from 'y/common/dto/message/dto/create.message.dto';
import { GetMessagesDto } from 'y/common/dto/message/dto/get.messages.dto';
import { UserInfo } from 'y/common/auth/user.decorator';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { TripInfoDto } from '../../../libs/common/src/dto/trip-info.dto';
import { CustomersService } from './customers.service';
import { LoginCustomerDto } from '../../../libs/common/src/dto/customer/dto/login.customer.dto';
import { SignUpCustomerDto } from '../../../libs/common/src/dto/customer/dto/signup.customer.dto';
import { UpdateCustomerDto } from '../../../libs/common/src/dto/customer/dto/update.customer.dto';
import { CreateTripDto, UpdateStatusCustomerDto } from 'y/common';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';

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

  async broadCastToDriversFacade(customerPositionDto: CustomerPositionDto) {
    return this.customersService.broadCastToDrivers(customerPositionDto);
  }
  async createTripFacade(createTripDto: CreateTripDto) {
    return this.customersService.createTrip(createTripDto);
  }
  async updateTripFacade(updateTripDto: UpdateTripDto) {
    return this.customersService.updateTrip(updateTripDto);
  }
  async getAllTripsFacade(customer: string) {
    return this.customersService.getAllTrips(customer);
  }
  async cancelTripFacade(tripInfo: TripInfoDto) {
    return this.customersService.cancelTrip(tripInfo);
  }
  //CRUD Customer
  async getCustomersFacade(): Promise<Customer[]> {
    return this.customersService.getCustomers();
  }

  async getNumberCustomersFacade() {
    return this.customersService.getNumberCustomers();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingCustomerFacade(
    updateStatusCustomerDto: UpdateStatusCustomerDto,
  ): Promise<Customer> {
    return this.customersService.updateStatusBlockingCustomer(
      updateStatusCustomerDto,
    );
  }

  async deleteCustomerFacade(customerID: string) {
    return this.customersService.deleteCustomer(customerID);
  }

  //Message
  async createMessageFacade(createMessageDto: CreateMessageDto) {
    return this.customersService.createMessage(createMessageDto);
  }
  async getMessagesWithDriverFacade(getMessagesDto: GetMessagesDto) {
    return this.customersService.getMessagesWithDriver(getMessagesDto);
  }

  //FEEDBACK

  async createFeedBackFacade(createFeedBackDto: CreateFeedBackDto) {
    return this.customersService.createFeedBack(createFeedBackDto);
  }
  async getCustomerFeedBacksFacade(id: string) {
    return this.customersService.getCustomerFeedBacks(id);
  }

  //NOTIFICATION
  async getCustomerNotificationsFacade(id: string) {
    return this.customersService.getCustomerNotifications(id);
  }

  async deleteNotificationFacade(id: string) {
    return this.customersService.deleteNotification(id);
  }
  async deleteAllNotificationsFacade(id: string) {
    return this.customersService.deleteAllNotifications(id);
  }
}
