import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { calculateTripCost, comparePassword, encodePassword } from 'y/common';
import { SignUpCustomerDto } from '../../../libs/common/src/dto/customer/dto/signup.customer.dto';
import { LoginCustomerDto } from '../../../libs/common/src/dto/customer/dto/login.customer.dto';
import { UpdateCustomerDto } from '../../../libs/common/src/dto/customer/dto/update.customer.dto';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { UpdateStatusCustomerDto, CreateTripDto, TripInfoDto } from 'y/common';
import { lastValueFrom, map } from 'rxjs';
import {
  DEMAND_SERVICE,
  FEEDBACK_SERVICE,
  MESSAGE_SERVICE,
  NOTIFICATION_SERVICE,
  REPORT_SERVICE,
  TRIP_SERVICE,
} from 'y/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { CreateMessageDto } from 'y/common/dto/message/dto/create.message.dto';
import { GetMessagesDto } from 'y/common/dto/message/dto/get.messages.dto';
import { CreateFeedBackDto } from 'y/common/dto/feedback/dto/create-feedback.dto';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';
import { generateOTP } from 'y/common/utils/generateOTP';
import { CreateNotificationTokenDto } from './../../../libs/common/src/dto/notification/dto/create-notification-token.dto';
import { SmsService } from 'y/common/service/sms.service';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CreateReportDto } from 'y/common/dto/report/create-report.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(
    private readonly customerRepository: CustomersRepository, // private jwtService: JwtService,
    @Inject(DEMAND_SERVICE) private readonly demandClient: ClientProxy,
    @Inject(TRIP_SERVICE) private readonly tripClient: ClientProxy,
    @Inject(MESSAGE_SERVICE) private readonly messageClient: ClientProxy,
    @Inject(FEEDBACK_SERVICE) private readonly feedbackClient: ClientProxy,
    @Inject(REPORT_SERVICE) private readonly reportClient: ClientProxy,

    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
    private readonly httpService: HttpService,
    private readonly smsService: SmsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async testAPI() {
    const basePricesRedis = JSON.parse(
      await this.cacheManager.get<string>('basePrices'),
    );
    console.log(basePricesRedis);
    const pricePerKilometerRedis = JSON.parse(
      await this.cacheManager.get<string>('pricePerKilometer'),
    );
    const startTimePeakHourRedis = JSON.parse(
      await this.cacheManager.get<string>('startTimePeakHour'),
    );
    const endTimePeakHourRedis = JSON.parse(
      await this.cacheManager.get<string>('endTimePeakHour'),
    );
    const surchargeIndexRedis = JSON.parse(
      await this.cacheManager.get<string>('surchargeIndex'),
    );
    const lat1 = '10.78865';
    const long1 = '106.70206';
    const distance = 11;
    const mode = 7;
    const tripCost = await calculateTripCost(
      lat1,
      long1,
      distance,
      mode,
      basePricesRedis,
      pricePerKilometerRedis,
      startTimePeakHourRedis,
      endTimePeakHourRedis,
      surchargeIndexRedis,
    );
    return {
      price: tripCost,
    };
  }
  async createOTP(phone: string) {
    const otp = await generateOTP();
    const content = `Mã OTP của bạn là: ${otp}`;
    console.log('OTP customer: ', otp);
    // await this.smsService.sendOTP(phone, otp);

    return { otp, phone };
  }

  async signUp(signUpCustomerDto: SignUpCustomerDto): Promise<Customer> {
    const { password } = signUpCustomerDto;

    const hashedPassword = await encodePassword(password);
    try {
      const customer = await this.customerRepository.create({
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
      customer = await this.customerRepository.findOne({ email });
    } else {
      customer = await this.customerRepository.findOne({ phone });
    }

    if (customer.blocked) {
      throw new UnauthorizedException('User has been blocked');
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

  async getInformation(id: string) {
    return this.customerRepository.findOne({ _id: id });
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

    const customerUpdated = await this.customerRepository.findOneAndUpdate(
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
    await this.customerRepository.delete({ _id: id });
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
  async cancelOrder() {
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

  async startNotifying(notification: CreateNotificationTokenDto) {
    const savedNotification = await lastValueFrom(
      this.notificationClient.send('create_notification', notification),
    );

    return {
      status: 'Ok',
      savedNotification,
    };
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

  async createTrip(request: any) {
    try {
      this.logger.log('send to trip client');
      this.logger.log(request);

      const trip = await lastValueFrom(
        this.tripClient.send({ cmd: 'create_trip_from_customer' }, request),
      );

      await this.httpService
        .post('http://tracking:3015/api/tracking-trip/new-trip', { trip })
        .pipe(map((response) => response.data));

      this.broadCastToDrivers(trip);

      return {
        status: HttpStatus.OK,
        elements: trip,
      };
    } catch (error) {
      this.logger.error('create trip from customer:' + error);
    }
  }

  async updateTrip(updateTripDto: UpdateTripDto) {
    try {
      const trip = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'update_trip_from_customer' },
          { updateTripDto },
        ),
      );
      const message = this.httpService
        .post('http://tracking:3015/api/tracking-trip/update-trip', { trip })
        .pipe(map((response) => response.data));

      this.logger.log({ message: await lastValueFrom(message) });
    } catch (error) {
      this.logger.error('update trip:' + error.message);
    }
  }

  async getAllTrips(customer: string) {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'get_all_trips_from_customer' },
          { customer },
        ),
      );
      return trips;
    } catch (error) {
      this.logger.error('get trips for customer: ' + error.message);
    }
  }
  async cancelTrip(tripInfo: TripInfoDto) {
    try {
      const trip = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'cancel_trip_from_customer' },
          { tripInfo },
        ),
      );

      this.demandClient.emit('update_trip', trip);

      return trip;
    } catch (error) {
      this.logger.error('cancel trip from customer: ' + error.message);
    }
  }

  async getAll(): Promise<Customer[]> {
    const customers = await this.customerRepository.find({});
    return customers;
  }

  async getCustomers(): Promise<Customer[]> {
    const customers = await this.customerRepository.find({});
    return customers;
  }

  async getNumberCustomers() {
    const customers = await this.customerRepository.find({});
    return customers.length;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingCustomer(
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

  async deleteAll(): Promise<{ msg: string }> {
    await this.customerRepository.deleteMany({});
    return { msg: 'Deleted All Customers' };
  }

  async broadCastToDrivers(tripRequest: CreateTripDto) {
    await lastValueFrom(
      this.demandClient.emit(
        'demand_broadcast_driver_from_customer',
        tripRequest,
      ),
    );
  }

  //Message
  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const message = await lastValueFrom(
        this.messageClient.send(
          { cmd: 'create_message_from_customer' },
          { createMessageDto },
        ),
      );
      return message;
    } catch (error) {
      this.logger.error('create messages for customer: ' + error.message);
    }
  }

  async getMessagesWithDriver(getMessagesDto: GetMessagesDto) {
    try {
      const message = await lastValueFrom(
        this.messageClient.send(
          { cmd: 'get_messages_from_customer' },
          { getMessagesDto },
        ),
      );
      return message;
    } catch (error) {
      this.logger.error('create messages for customer: ' + error.message);
    }
  }

  //Feedback
  async createFeedBack(createFeedBackDto: CreateFeedBackDto) {
    try {
      const feedback = await lastValueFrom(
        this.feedbackClient.send(
          { cmd: 'create_feedback_from_customer' },
          { createFeedBackDto },
        ),
      );
      return feedback;
    } catch (error) {
      this.logger.error('create feedback for customer: ' + error.message);
    }
  }
  async getCustomerFeedBacks(id: string) {
    try {
      const feedbacks = await lastValueFrom(
        this.feedbackClient.send(
          { cmd: 'get_feedbacks_from_customer' },
          { id },
        ),
      );
      return feedbacks;
    } catch (error) {
      this.logger.error('get feedbacks for customer: ' + error.message);
    }
  }

  //NOTIFICATION
  async getCustomerNotifications(id: string) {
    try {
      const notifications = await lastValueFrom(
        this.notificationClient.send(
          { cmd: 'get_notifications_from_customer' },
          { id },
        ),
      );
      return notifications;
    } catch (error) {
      this.logger.error('get notifications for customer: ' + error.message);
    }
  }
  async deleteNotification(id: string) {
    await lastValueFrom(
      this.notificationClient.emit('delete_notification_from_customer', {
        id,
      }),
    );
  }

  async deleteAllNotifications(id: string) {
    await lastValueFrom(
      this.notificationClient.emit('delete_all_notifications_from_customer', {
        id,
      }),
    );
  }

  //REPORT
  async createReport(createReportDto: CreateReportDto) {
    try {
      const report = await lastValueFrom(
        this.reportClient.send(
          { cmd: 'create_report_from_customer' },
          { createReportDto },
        ),
      );
      return report;
    } catch (error) {
      this.logger.error('create report for customer: ' + error.message);
    }
  }
}
