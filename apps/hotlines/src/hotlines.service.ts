import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import {
  UpdateStatusHotlineDto,
  CreateTripDto,
  LoginHotlineDto,
  SignUpHotlineDto,
  UpdateHotlineDto,
  UpdateTripLocationDto,
} from 'y/common';
import { DEMAND_SERVICE, TRIP_SERVICE } from 'y/common/constants/services';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { CreateHotlineDto } from 'y/common/dto/admin/create.hotline.dto';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';
import { EsmsService } from 'y/common/service/esms.service';
import { SmsService } from 'y/common/service/sms.service';
import { comparePassword, encodePassword } from 'y/common/utils/bcrypt';
import { generateOTP } from 'y/common/utils/generateOTP';

@Injectable()
export class HotlinesService {
  private readonly logger = new Logger(HotlinesService.name);

  constructor(
    private readonly hotlineRepository: HotlinesRepository,
    @Inject(TRIP_SERVICE) private tripClient: ClientProxy,
    @Inject(DEMAND_SERVICE) private demandClient: ClientProxy,
    private readonly httpService: HttpService,
    private readonly smsService: SmsService,
  ) {}

  async createOTP(phone: string) {
    const otp = await generateOTP();
    const content = `Mã OTP của bạn là: ${otp}`;
    console.log('OTP hotline: ', otp);
    // await this.smsService.sendOTP(phone, otp);

    return { otp, phone };
  }

  async getPoints(id: string) {
    try {
      const points = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_points_from_hotline' }, { id }),
      );
      const hotline = await this.hotlineRepository.findOneAndUpdate(
        { _id: id },
        { points },
      );
      return hotline;
    } catch (error) {
      this.logger.error('get points:' + error.message);
    }
  }
  async createTrip(request: any) {
    this.logger.log('send to trip client');
    try {
      const trip = await lastValueFrom(
        this.tripClient.send({ cmd: 'create_trip' }, request),
      );

      if (trip.lat_pickup && trip.long_pickup) {
        this.broadCastToDrivers(trip);
      }
      
      this.smsService.sendMessage("","Đang tìm tài xế, bạn đợi xíu nhé!");

      return {
        status: HttpStatus.OK,
        elements: trip,
      };
    } catch (error) {
      this.logger.error('create trip:' + error.message);
    }
  }

  async getAllTrip() {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_trips' }, {}),
      );

      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async getAllTripByPhoneNumber(phone: string) {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_trips_by_phone_number' }, { phone }),
      );

      return trips;
    } catch (error) {
      this.logger.error('get trip:' + error.message);
    }
  }

  async getAllUnlocatedTrip() {
    try {
      const trips = await lastValueFrom(
        this.tripClient.send({ cmd: 'get_unlocated_trip' }, {}),
      );

      return {
        status: HttpStatus.OK,
        elements: trips,
      };
    } catch (err) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, msg: err.message };
    }
  }

  async updateTrip(updateTripDto: UpdateTripDto) {
    try {
      const trip = await lastValueFrom(
        this.tripClient.send({ cmd: 'update_trip' }, updateTripDto),
      );

      if (!trip.driver) this.broadCastToDrivers(trip);

      return {
        status: HttpStatus.OK,
        elements: trip,
      };
    } catch (error) {
      this.logger.error('update trip:' + error.message);
    }
  }

  async broadCastToDrivers(trip: CreateTripDto) {
    await lastValueFrom(
      this.demandClient.emit('demand_broadcast_driver_from_hotline', trip),
    );
  }
  async signUp(signUpHotlineDto: SignUpHotlineDto): Promise<Hotline> {
    const { password } = signUpHotlineDto;

    const hashedPassword = await encodePassword(password);
    try {
      const hotline = await this.hotlineRepository.create({
        ...signUpHotlineDto,
        password: hashedPassword,
      });

      return hotline;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginHotlineDto: LoginHotlineDto): Promise<Hotline> {
    const { email, password, phone } = loginHotlineDto;
    let hotline: Hotline;

    if (email) {
      hotline = await this.hotlineRepository.findOne({ email });
    } else {
      hotline = await this.hotlineRepository.findOne({ phone });
    }

    if (!hotline) {
      throw new UnauthorizedException('Invalid credential');
    }
    if (hotline.blocked) {
      throw new UnauthorizedException('User has been blocked');
    }
    const isPasswordMatched = await comparePassword(password, hotline.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return hotline;
  }

  async getInformation(id: string) {
    return this.hotlineRepository.findOne({ _id: id });
  }

  async updateAccount(
    updateHotlineDto: UpdateHotlineDto,
    id: string,
  ): Promise<Hotline> {
    const { username, password, gender, address, dob } = updateHotlineDto;

    if (!username && !password && !gender && !address && !dob) {
      throw new BadRequestException('Need to input at least 1 information');
    }
    const hashedPassword = await encodePassword(password);

    const hotlineUpdated = await this.hotlineRepository.findOneAndUpdate(
      { _id: id },
      {
        username,
        password: hashedPassword,
        gender,
        dob,
        address,
      },
    );

    return hotlineUpdated;
  }

  async deleteAccount(id: string): Promise<{ msg: string }> {
    await this.hotlineRepository.delete({ _id: id });
    return { msg: 'Deleted Account' };
  }

  //Quên mật khẩu
  async forgotPassword() {
    return null;
  }

  //Xem thông tin tài xế, khách hàng
  async getInforDriverAndCustomer() {
    return null;
  }

  //Theo dõi lộ trình của chuyến xe
  async getRideInfor() {
    return null;
  }

  //Huỷ chuyến xe
  async cancelTrip() {
    return null;
  }

  //Xem danh sách đơn đặt xe (đặt qua điện thoại)
  async getTripsInHotline() {
    return null;
  }

  //Xem danh sách lịch sử các đơn hàng của người dùng hotline
  async getTripsInfor() {
    return null;
  }

  async getAll(): Promise<Hotline[]> {
    const hotlines = await this.hotlineRepository.find({});
    return hotlines;
  }

  async getHotlines(): Promise<Hotline[]> {
    const hotlines = await this.hotlineRepository.find({});
    return hotlines;
  }

  async getNumberHotlines() {
    const hotlines = await this.hotlineRepository.find({});
    return hotlines.length;
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingHotline(
    updateStatusHotlineDto: UpdateStatusHotlineDto,
  ): Promise<Hotline> {
    const { id, blocked } = updateStatusHotlineDto;

    const hotline = await this.hotlineRepository.findOneAndUpdate(
      { _id: id },
      { blocked },
    );
    if (!hotline) {
      throw new NotFoundException('Not Found hotline');
    }
    console.log(hotline);
    return hotline;
  }

  async deleteHotline(hotlineID: string): Promise<{ msg: string }> {
    await this.hotlineRepository.delete({ _id: hotlineID });
    return { msg: `Delete hotline with id ${hotlineID} successfully` };
  }

  async createHotline(createHotlineDto: CreateHotlineDto): Promise<Hotline> {
    const { password } = createHotlineDto;

    const hashedPassword = await encodePassword(password);
    try {
      const hotline = await this.hotlineRepository.create({
        ...createHotlineDto,
        password: hashedPassword,
      });

      return hotline;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async deleteAll(): Promise<{ msg: string }> {
    await this.hotlineRepository.deleteMany({});
    return { msg: 'Deleted All Hotlines' };
  }

  // async demandTrip(customerPositionDto: CustomerPositionDto) {
  //   return this.demandService.requestRideFromHotline(customerPositionDto);
  // }
}
