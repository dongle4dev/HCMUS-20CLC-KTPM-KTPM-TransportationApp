import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CalculatePriceTripsDto,
  CreateHotlineDto,
  LoginAdminDto,
  SignUpAdminDto,
  UpdateStatusCustomerDto,
  UpdateStatusDriverDto,
  UpdateStatusHotlineDto,
} from 'y/common';
import { lastValueFrom } from 'rxjs';
import { comparePassword, encodePassword } from 'y/common';
import {
  CUSTOMER_SERVICE,
  DRIVER_SERVICE,
  HOTLINE_SERVICE,
  VEHICLE_SERVICE,
  TRIP_SERVICE,
  FEEDBACK_SERVICE,
  REPORT_SERVICE,
} from 'y/common/constants/services';
import { AdminsRepository } from 'y/common/database/admin/repository/admins.repository';
import { Admin } from 'y/common/database/admin/schema/admin.schema';
import { CustomersRepository } from 'y/common/database/customer/repository/customers.repository';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { DriversRepository } from 'y/common/database/driver/repository/drivers.repository';
import { Driver } from 'y/common/database/driver/schema/driver.schema';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { VehiclesRepository } from 'y/common/database/vehicle/repository/vehicles.repository';
import { Vehicle } from 'y/common/database/vehicle/schema/vehicle.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CalculateTripRedisDto } from 'y/common/dto/admin/set-redis.dto';
import { StatisticDriverDto } from 'y/common/dto/trip/statistic-driver.dto';
import { StatisticAllDriversDto } from 'y/common/dto/trip/statistic-all-drivers.dto';
@Injectable()
export class AdminsService {
  private readonly logger = new Logger(AdminsService.name);
  constructor(
    // @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly adminRepository: AdminsRepository, // private jwtService: JwtService,
    @Inject(CUSTOMER_SERVICE) private readonly customerClient: ClientProxy,
    @Inject(DRIVER_SERVICE) private readonly driverClient: ClientProxy,
    @Inject(HOTLINE_SERVICE) private readonly hotlineClient: ClientProxy,
    @Inject(VEHICLE_SERVICE) private readonly vehicleClient: ClientProxy,
    @Inject(TRIP_SERVICE) private readonly tripClient: ClientProxy,
    @Inject(FEEDBACK_SERVICE) private readonly feedbackClient: ClientProxy,
    @Inject(REPORT_SERVICE) private readonly reportClient: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async onApplicationBootstrap() {
    const basePrices = {
      1: 10000,
      4: 15000,
      7: 20000,
    };

    const pricePerKilometer = {
      1: {
        upTo10Km: 8000,
        after10Km: 5000,
      },
      4: {
        upTo10Km: 13000,
        after10Km: 10000,
      },
      7: {
        upTo10Km: 18000,
        after10Km: 15000,
      },
    };
    const startTimePeakHour = 7;
    const endTimePeakHour = 9;
    const surchargeIndexLevel1 = 1.2;
    const surchargeIndexLevel2 = 1.5;

    await this.cacheManager.set('basePrices', JSON.stringify(basePrices), {
      ttl: 60000,
    });

    await this.cacheManager.set(
      'pricePerKilometer',
      JSON.stringify(pricePerKilometer),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'startTimePeakHour',
      JSON.stringify(startTimePeakHour),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'endTimePeakHour',
      JSON.stringify(endTimePeakHour),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'surchargeIndexLevel1',
      JSON.stringify(surchargeIndexLevel1),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'surchargeIndexLevel2',
      JSON.stringify(surchargeIndexLevel2),
      {
        ttl: 60000,
      },
    );
  }

  async setCalculateRedis(calculateTripRedisDto: CalculateTripRedisDto) {
    const basePrices = {
      1: calculateTripRedisDto.bike_basePrice,
      4: calculateTripRedisDto.car_basePrice,
      7: calculateTripRedisDto.van_basePrice,
    };

    const pricePerKilometer = {
      1: {
        upTo10Km: calculateTripRedisDto.bike_upTo10Km,
        after10Km: calculateTripRedisDto.bike_after10Km,
      },
      4: {
        upTo10Km: calculateTripRedisDto.car_upTo10Km,
        after10Km: calculateTripRedisDto.car_after10Km,
      },
      7: {
        upTo10Km: calculateTripRedisDto.van_upTo10Km,
        after10Km: calculateTripRedisDto.van_after10Km,
      },
    };
    const startTimePeakHour = calculateTripRedisDto.startTimePeakHour;
    const endTimePeakHour = calculateTripRedisDto.endTimePeakHour;
    const surchargeIndexLevel1 = calculateTripRedisDto.surchargeIndexLevel1;
    const surchargeIndexLevel2 = calculateTripRedisDto.surchargeIndexLevel2;

    await this.cacheManager.set('basePrices', JSON.stringify(basePrices), {
      ttl: 60000,
    });

    await this.cacheManager.set(
      'pricePerKilometer',
      JSON.stringify(pricePerKilometer),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'startTimePeakHour',
      JSON.stringify(startTimePeakHour),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'endTimePeakHour',
      JSON.stringify(endTimePeakHour),
      {
        ttl: 60000,
      },
    );
    await this.cacheManager.set(
      'surchargeIndexLevel1',
      JSON.stringify(surchargeIndexLevel1),
      {
        ttl: 60000,
      },
    );

    await this.cacheManager.set(
      'surchargeIndexLevel2',
      JSON.stringify(surchargeIndexLevel2),
      {
        ttl: 60000,
      },
    );

    return {
      basePrices,
      pricePerKilometer,
      startTimePeakHour,
      endTimePeakHour,
      surchargeIndexLevel1,
      surchargeIndexLevel2,
    };
  }

  async getCalculateRedis() {
    const basePricesRedis = JSON.parse(
      await this.cacheManager.get<string>('basePrices'),
    );
    const pricePerKilometerRedis = JSON.parse(
      await this.cacheManager.get<string>('pricePerKilometer'),
    );
    const startTimePeakHourRedis = JSON.parse(
      await this.cacheManager.get<string>('startTimePeakHour'),
    );
    const endTimePeakHourRedis = JSON.parse(
      await this.cacheManager.get<string>('endTimePeakHour'),
    );
    const surchargeIndexLevel1Redis = JSON.parse(
      await this.cacheManager.get<string>('surchargeIndexLevel1'),
    );
    const surchargeIndexLevel2Redis = JSON.parse(
      await this.cacheManager.get<string>('surchargeIndexLevel2'),
    );

    return {
      basePricesRedis,
      pricePerKilometerRedis,
      startTimePeakHourRedis,
      endTimePeakHourRedis,
      surchargeIndexLevel1Redis,
      surchargeIndexLevel2Redis,
    };
  }
  async signUp(request: SignUpAdminDto): Promise<Admin> {
    const { password } = request;

    const hashedPassword = await encodePassword(password);
    try {
      const admin = await this.adminRepository.create({
        ...request,
        password: hashedPassword,
      });
      return admin;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      console.log(e);
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<Admin> {
    const { email, password } = loginAdminDto;
    const admin = await this.adminRepository.findOne({ email });

    if (!admin) {
      throw new UnauthorizedException('Invalid credential');
    }
    const isPasswordMatched = await comparePassword(password, admin.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return admin;
  }

  // Quên mật khẩu
  async forgotPassword() {
    return null;
  }

  //CRUD Driver
  async getDrivers(): Promise<Driver[]> {
    try {
      const drivers = await lastValueFrom(
        this.driverClient.send({ cmd: 'get_drivers_from_admin' }, {}),
      );

      return drivers;
    } catch (error) {
      this.logger.error('get driver:' + error.message);
    }
  }

  async getNumberDrivers() {
    try {
      const number = await lastValueFrom(
        this.driverClient.send({ cmd: 'get_number_drivers_from_admin' }, {}),
      );

      return number;
    } catch (error) {
      this.logger.error('get driver:' + error.message);
    }
  }
  // Mở hoặc khoá tài khoản
  async updateStatusBlockingDriver(
    updateStatusDriverDto: UpdateStatusDriverDto,
  ): Promise<Driver> {
    try {
      const driver = await lastValueFrom(
        this.driverClient.send(
          { cmd: 'update_driver_from_admin' },
          { updateStatusDriverDto },
        ),
      );

      return driver;
    } catch (error) {
      this.logger.error('update driver:' + error.message);
    }
  }

  async deleteDriver(id: string) {
    await lastValueFrom(
      this.driverClient.emit('delete_driver_from_admin', {
        id,
      }),
    );
  }

  //CRUD Customer
  async getCustomers(): Promise<Customer[]> {
    try {
      const customers = await lastValueFrom(
        this.customerClient.send({ cmd: 'get_customers_from_admin' }, {}),
      );

      return customers;
    } catch (error) {
      this.logger.error('get customer:' + error.message);
    }
  }

  async getNumberCustomers() {
    try {
      const number = await lastValueFrom(
        this.customerClient.send(
          { cmd: 'get_number_customers_from_admin' },
          {},
        ),
      );

      return number;
    } catch (error) {
      this.logger.error('get customer:' + error.message);
    }
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingCustomer(
    updateStatusCustomerDto: UpdateStatusCustomerDto,
  ): Promise<Customer> {
    try {
      const customer = await lastValueFrom(
        this.customerClient.send(
          { cmd: 'update_customer_from_admin' },
          { updateStatusCustomerDto },
        ),
      );

      return customer;
    } catch (error) {
      this.logger.error('update customer:' + error.message);
    }
  }

  async deleteCustomer(id: string) {
    await lastValueFrom(
      this.customerClient.emit('delete_customer_from_admin', {
        id,
      }),
    );
  }

  //CRUD Hotline
  async getHotlines(): Promise<Hotline[]> {
    try {
      const hotlines = await lastValueFrom(
        this.hotlineClient.send({ cmd: 'get_hotlines_from_admin' }, {}),
      );

      return hotlines;
    } catch (error) {
      this.logger.error('get hotline:' + error.message);
    }
  }
  async getNumberHotlines() {
    try {
      const number = await lastValueFrom(
        this.hotlineClient.send({ cmd: 'get_number_hotlines_from_admin' }, {}),
      );

      return number;
    } catch (error) {
      this.logger.error('get hotline:' + error.message);
    }
  }
  // Mở hoặc khoá tài khoản
  async updateStatusBlockingHotline(
    updateStatusHotlineDto: UpdateStatusHotlineDto,
  ): Promise<Hotline> {
    try {
      const hotline = await lastValueFrom(
        this.hotlineClient.send(
          { cmd: 'update_hotline_from_admin' },
          { updateStatusHotlineDto },
        ),
      );

      return hotline;
    } catch (error) {
      this.logger.error('update hotline:' + error.message);
    }
  }

  async deleteHotline(id: string) {
    await lastValueFrom(
      this.hotlineClient.emit('delete_hotline_from_admin', {
        id,
      }),
    );
  }

  async createHotline(createHotlineDto: CreateHotlineDto): Promise<Hotline> {
    try {
      const hotline = await lastValueFrom(
        this.hotlineClient.send(
          { cmd: 'create_hotline_from_admin' },
          { createHotlineDto },
        ),
      );

      return hotline;
    } catch (error) {
      this.logger.error('get hotline:' + error.message);
    }
  }

  async getAllTrips() {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_trips_from_admin' }, {}),
      );

      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async getCancelTrips() {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_cancel_trips_from_admin' }, {}),
      );

      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async getFinishTrips() {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_finish_trips_from_admin' }, {}),
      );
      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }
  // Quản lý đơn hàng
  //Xem doanh thu ngày, tháng, năm/theo driver, loại xe,...
  async getRevenue() {
    return null;
  }

  async getOrders() {
    return null;
  }

  async updateOrder() {
    return null;
  }

  async deleteOrder() {
    return null;
  }

  //Xem report, xoá report, phản hồi report
  async getReports() {
    return null;
  }

  async responseReport() {
    return null;
  }

  async deleteReport() {
    return null;
  }

  // xem Vehicle, xoá Vehicle
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const vehicles = await lastValueFrom(
        this.vehicleClient.send({ cmd: 'get_vehicles_from_admin' }, {}),
      );

      return vehicles;
    } catch (error) {
      this.logger.error('get vehicle:' + error.message);
    }
  }

  async deleteVehicle(vehicleID: string) {
    await lastValueFrom(
      this.vehicleClient.emit('delete_vehicle_from_admin', {
        vehicleID,
      }),
    );
  }

  //TRIP

  async calculatePriceTripsByTime(
    calculatePriceTripsDto: CalculatePriceTripsDto,
  ) {
    try {
      const price = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'calculate_trips_by_time_from_admin' },
          { calculatePriceTripsDto },
        ),
      );
      return price;
    } catch (error) {
      this.logger.error('get trips price:' + error.message);
    }
  }

  async calculatePriceAllTrips() {
    try {
      const price = await lastValueFrom(
        this.tripClient.send({ cmd: 'calculate_all_trips_from_admin' }, {}),
      );
      return price;
    } catch (error) {
      this.logger.error('get trips price:' + error.message);
    }
  }

  async statisticAllDriversByTime(
    statisticAllDriversDto: StatisticAllDriversDto,
  ) {
    statisticAllDriversDto.drivers = await this.getDrivers();
    try {
      const statistics = await lastValueFrom(
        this.tripClient.send(
          { cmd: 'statistic_drivers_by_time_from_admin' },
          { statisticAllDriversDto },
        ),
      );
      return statistics;
    } catch (error) {
      this.logger.error('statistic driver:' + error.message);
    }
  }
  async getAll(): Promise<Admin[]> {
    const admins = await this.adminRepository.find({});
    return admins;
  }

  // FEEDBACK

  async getAllFeedBacks() {
    try {
      const feedbacks = await lastValueFrom(
        this.feedbackClient.send({ cmd: 'get_feedbacks_from_admin' }, {}),
      );
      return feedbacks;
    } catch (error) {
      this.logger.error('get all feedbacks for admin: ' + error.message);
    }
  }

  async deleteFeedBack(id: string) {
    await lastValueFrom(
      this.feedbackClient.emit('delete_feedback_from_admin', {
        id,
      }),
    );
  }

  async deleteAllFeedBacks() {
    await lastValueFrom(
      this.feedbackClient.emit('delete_all_feedbacks_from_admin', {}),
    );
  }

  //REPORT
  async getAllReports() {
    try {
      const reports = await lastValueFrom(
        this.reportClient.send({ cmd: 'get_reports_from_admin' }, {}),
      );
      return reports;
    } catch (error) {
      this.logger.error('get reports for admin: ' + error.message);
    }
  }

  async deleteAllReports() {
    await lastValueFrom(
      this.reportClient.emit('delete_all_reports_from_admin', {}),
    );
  }
}
