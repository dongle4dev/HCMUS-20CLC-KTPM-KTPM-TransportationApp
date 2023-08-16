import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { SignUpHotlineDto } from './dto/signup.hotline.dto';
import { LoginHotlineDto } from './dto/login.hotline.dto';
import { UpdateHotlineDto } from './dto/update.hotline.dto';
import { HotlinesRepository } from 'y/common/database/hotline/repository/hotlines.repository';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { CreateTripDto } from 'apps/trips/src/dto/create-trip.dto';
import { TRIP_SERVICE } from 'y/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HotlinesService {
  private readonly logger = new Logger(HotlinesService.name);

  constructor(
    private readonly hotlineRepository: HotlinesRepository,
    @Inject(TRIP_SERVICE) private tripClient: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  async createTrip(request: any) {
    this.logger.log('send to trip client');
    try {
      const trip = await this.tripClient.emit('create_trip', request);

      const message = this.httpService
        .post('http://172.18.0.1:3015/api/tracking-trip', { trip })
        .pipe(map((response) => response.data));
      this.logger.log({ message: await lastValueFrom(message) });
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

  async deleteAll(): Promise<{ msg: string }> {
    await this.hotlineRepository.deleteMany({});
    return { msg: 'Deleted All Hotlines' };
  }

  // async demandTrip(customerPositionDto: CustomerPositionDto) {
  //   return this.demandService.requestRideFromHotline(customerPositionDto);
  // }
}
