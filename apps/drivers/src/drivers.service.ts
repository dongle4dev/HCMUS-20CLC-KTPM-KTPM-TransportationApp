import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupplyService } from 'apps/supply/src/supply.service';
import {
  DEMAND_SERVICE,
  FEEDBACK_SERVICE,
  MESSAGE_SERVICE,
  NOTIFICATION_SERVICE,
  SUPPLY_SERVICE,
  TRIP_SERVICE,
  VEHICLE_SERVICE,
} from 'y/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateMessageDto } from 'y/common/dto/message/dto/create.message.dto';
import { GetMessagesDto } from 'y/common/dto/message/dto/get.messages.dto';
import { CreateNotificationDto } from 'y/common/dto/notification/dto/create-notification.dto';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { SignUpDriverDto } from 'y/common/dto/driver/dto/signup.driver.dto';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import {
  CalculatePriceTripsDto,
  comparePassword,
  encodePassword,
  UpdateTripStatusDto,
} from 'y/common';
import { LoginDriverDto } from 'y/common/dto/driver/dto/login.driver.dto';
import { UpdateDriverDto } from 'y/common/dto/driver/dto/update.driver.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { generateOTP } from 'y/common/utils/generateOTP';
// import { SmsService } from 'y/common/service/sms.service';
import { DeleteMessagesDto } from 'y/common/dto/message/dto/delete.message.dto';
import { CreateVehicleDto } from 'y/common/dto/vehicle/dto/create.vehicle.dto';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);
  constructor(
    private readonly driverRepository: DriversRepository,
    @Inject(SUPPLY_SERVICE) private supplyClient: ClientProxy,
    @Inject(DEMAND_SERVICE) private demandClient: ClientProxy,
    @Inject(TRIP_SERVICE) private tripClient: ClientProxy,
    @Inject(MESSAGE_SERVICE) private messageClient: ClientProxy,
    @Inject(FEEDBACK_SERVICE) private feedbackClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy,
    @Inject(VEHICLE_SERVICE) private vehicleClient: ClientProxy, // private readonly smsService: SmsService,
  ) {}

  async createOTP(phone: string) {
    const otp = await generateOTP();
    const content = `Mã OTP của bạn là: ${otp}`;
    console.log('OTP Driver: ', otp);
    // await this.smsService.sendOTP(phone, otp);

    // await this.eSmsService.sendSMS(phone, content);
    return { otp, phone };
  }

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

  async getInformation(id: string) {
    return this.driverRepository.findOne({ _id: id });
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
  async getTripInformation() {
    return null;
  }

  //Xác nhận đơn( Đơn thường hay Đơn Vip)
  async acceptTrip(trip: any) {
    try {
      const foundDriver = await this.driverRepository.findOne({
        _id: trip.driver,
      });
      const foundVehicle = await this.getDriverVehicle(trip.driver);

      delete foundVehicle.driver;

      const driver = {
        id: foundDriver._id,
        username: foundDriver.username,
        phone: foundDriver.phone,
        gender: foundDriver.gender,
        dob: foundDriver.dob,
        address: foundDriver.address,
        rated: foundDriver.rated,
        vehicle: foundVehicle,
      };

      const savedTrip = await lastValueFrom(
        this.tripClient.send({ cmd: 'update_trip' }, trip),
      );

      savedTrip.driver = driver;

      this.demandClient.emit('accept_trip', savedTrip);

      return savedTrip;
    } catch (error) {
      this.logger.error(error);
    }
  }

  //Huỷ đơn
  async cancelTrip() {
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
  async getTrips() {
    return null;
  }

  async getAll(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find({});
    return drivers;
  }

  async getDrivers(): Promise<Driver[]> {
    const drivers = await this.driverRepository.find({});
    return drivers;
  }

  async getNumberDrivers() {
    const drivers = await this.driverRepository.find({});
    return drivers.length;
  }
  // Mở hoặc khoá tài khoản
  async updateStatusBlockingDriver(
    updateStatusDriverDto: any,
  ): Promise<Driver> {
    console.log(updateStatusDriverDto);
    const { id, blocked } = updateStatusDriverDto;

    const driver = await this.driverRepository.findOneAndUpdate(
      { _id: id },
      { blocked },
    );

    if (!driver) {
      throw new NotFoundException('Not Found driver');
    }
    return driver;
  }

  // Mở hoặc khoá tài khoản
  async updateStatus(updateStatusDriverDto: any): Promise<Driver> {
    const { id, status } = updateStatusDriverDto;

    const driver = await this.driverRepository.findOneAndUpdate(
      { _id: id },
      { status },
    );

    if (!driver) {
      throw new NotFoundException('Not Found driver');
    }
    return driver;
  }

  async deleteDriver(driverID: any): Promise<{ msg: string }> {
    console.log(driverID);
    await this.driverRepository.delete({ _id: driverID });
    return { msg: `Delete driver with id ${driverID} successfully` };
  }

  async deleteAll(): Promise<{ msg: string }> {
    await this.driverRepository.deleteMany({});
    return { msg: 'Deleted All Drivers' };
  }

  // @Interval(60000)
  async updateLocation(driverPositionDto: DriverPositionDto) {
    // await this.supplyService.updateDriverLocation(driverPositionDto);
    await lastValueFrom(
      this.supplyClient.emit('supply_driver_position', {
        driverPositionDto,
      }),
    );
  }

  async updateTripStatus(updateTripStatusDto: UpdateTripStatusDto) {
    try {
      const trip = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'update_trip_status_from_driver' },
          { updateTripStatusDto },
        ),
      );

      this.demandClient.emit('update_trip', trip);

      return trip;
    } catch (error) {
      this.logger.error('update trip:' + error.message);
    }
  }

  async getDriverTrips(id: string) {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_all_trips_from_driver' }, { id }),
      );

      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async getRevenue(id: string) {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_revenue_trips_from_driver' }, { id }),
      );

      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }
  async getRevenueByTime(calculatePriceTripsDto: CalculatePriceTripsDto) {
    try {
      const revenue = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'get_revenue_by_time_trips_from_driver' },
          { calculatePriceTripsDto },
        ),
      );

      return revenue;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async getRevenueByWeek(id: string, week: number) {
    try {
      const revenue = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'get_revenue_week_trips_from_driver' },
          { id, week },
        ),
      );

      return revenue;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async handleReceivedBroadCast(data: any) {
    console.log('------------------------');
    this.logger.log('Received...', data);
    console.log('------------------------');
  }

  //Messsage
  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const message = await lastValueFrom(
        this.messageClient.send(
          { cmd: 'create_message_from_driver' },
          { createMessageDto },
        ),
      );
      return message;
    } catch (error) {
      this.logger.error('create messages for driver: ' + error.message);
    }
  }

  async getMessagesWithCustomer(getMessagesDto: GetMessagesDto) {
    try {
      const message = await lastValueFrom(
        this.messageClient.send(
          { cmd: 'get_messages_from_driver' },
          { getMessagesDto },
        ),
      );
      return message;
    } catch (error) {
      this.logger.error('create messages for driver: ' + error.message);
    }
  }

  async deleteBothMessages(deleteMessagesDto: DeleteMessagesDto) {
    await lastValueFrom(
      this.messageClient.emit('delete_messages_from_driver', {
        deleteMessagesDto,
      }),
    );
  }

  //FEEDBACK
  async getDriverFeedBacks(id: string) {
    try {
      const feedback = await lastValueFrom(
        this.feedbackClient.send({ cmd: 'get_feedbacks_from_driver' }, { id }),
      );
      return feedback;
    } catch (error) {
      this.logger.error('get feedback for driver: ' + error.message);
    }
  }

  async getDriverRated(id: string) {
    try {
      const rated = await lastValueFrom(
        this.feedbackClient.send({ cmd: 'get_rated_from_driver' }, { id }),
      );
      const driver = await this.driverRepository.findOneAndUpdate(
        { _id: id },
        { rated },
      );
      return driver;
    } catch (error) {
      this.logger.error('get rated for driver: ' + error.message);
    }
  }

  //NOTIFICATION
  async createNotification(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await lastValueFrom(
        this.notificationClient.send(
          { cmd: 'create_notification_from_driver' },
          { createNotificationDto },
        ),
      );
      return notification;
    } catch (error) {
      this.logger.error('create notification for driver: ' + error.message);
    }
  }

  //VEHICLE
  async registerVehicle(createVehicleDto: CreateVehicleDto) {
    try {
      const vehicle = await lastValueFrom(
        this.vehicleClient.send(
          { cmd: 'register_vehicle_from_driver' },
          { createVehicleDto },
        ),
      );
      return vehicle;
    } catch (error) {
      this.logger.error('register vehicle for driver: ' + error.message);
    }
  }

  async getDriverVehicle(id: string) {
    try {
      const vehicle = await lastValueFrom(
        this.vehicleClient.send({ cmd: 'get_vehicle_from_driver' }, { id }),
      );
      return vehicle;
    } catch (error) {
      this.logger.error('get vehicle for driver: ' + error.message);
    }
  }

  async deleteDriverVehicle(id: string) {
    await lastValueFrom(
      this.vehicleClient.emit('delete_driver_vehicle_from_driver', {
        id,
      }),
    );
  }
}
