import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { SignUpDriverDto } from './dto/signup.driver.dto';
import { LoginDriverDto } from './dto/login.driver.dto';
import { UpdateDriverDto } from './dto/update.driver.dto';
import { SupplyService } from 'apps/supply/src/supply.service';
import { Interval } from '@nestjs/schedule';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import {
  MESSAGE_SERVICE,
  SUPPLY_SERVICE,
  TRIP_SERVICE,
} from 'y/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UpdateTripStatusDto } from 'apps/trips/src/dto/update-trip-status.dto';
import { UpdateStatusDriverDto } from 'apps/admins/src/dto/updateStatus.driver.dto';
import { CalculatePriceTripsDto } from 'apps/trips/src/dto/calculate-price-trips.dto';
import { CreateMessageDto } from 'apps/messages/src/dto/create.message.dto';
import { GetMessagesDto } from 'apps/messages/src/dto/get.messages.dto';

@Injectable()
export class DriversService {
  private readonly logger = new Logger(DriversService.name);
  constructor(
    private readonly driverRepository: DriversRepository, // private jwtService: JwtService,
    private readonly supplyService: SupplyService,
    @Inject(SUPPLY_SERVICE) private supplyClient: ClientProxy,
    @Inject(TRIP_SERVICE) private tripClient: ClientProxy,
    @Inject(MESSAGE_SERVICE) private messageClient: ClientProxy,
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

      return trip;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
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
}
