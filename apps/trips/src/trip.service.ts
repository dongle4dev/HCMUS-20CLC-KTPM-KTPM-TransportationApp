import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Subject, lastValueFrom, map } from 'rxjs';
import {
  CreateTripDto,
  UpdateTripLocationDto,
  UpdateTripStatusDto,
  TripInfoDto,
} from 'y/common';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { UpdateTripDto } from 'y/common/dto/update-trip.dto';
import { StatusTrip } from 'y/common/utils/enum';
import { CalculatePriceTripsDto } from '../../../libs/common/src/dto/calculate-price-trips.dto';
import { HttpService } from '@nestjs/axios';
import { StatisticAllDriversDto } from 'y/common/dto/trip/statistic-all-drivers.dto';
import { StatisticDriverDto } from 'y/common/dto/trip/statistic-driver.dto';
import { SmsService } from 'y/common/service/sms.service';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    private readonly tripRepository: TripRepository,
    private readonly httpService: HttpService,
    private readonly smsService: SmsService,
  ) {}

  async createTrip(createTripDto: any) {
    const trip = await this.tripRepository.create(createTripDto);

    if (!trip.lat_pickup && !trip.long_pickup) {
      const message = await this.httpService
        .post('http://tracking:3015/api/tracking-trip/new-trip', { trip })
        .pipe(map((response) => response.data));

      this.smsService.sendMessage("","Đang tìm tài xế, bạn đợi xíu nhé!");
      this.logger.log(lastValueFrom(message));
    }

    const message = await this.httpService
      .post('http://tracking:3015/api/tracking-trip/update-trip', { trip })
      .pipe(map((response) => response.data));

    this.logger.log(lastValueFrom(message));

    return trip;
  }

  async deleteAll() {
    return this.tripRepository.deleteMany({});
  }

  async getAllTrip(): Promise<Trip[]> {
    return this.tripRepository.find({});
  }

  async getCancelTrip(): Promise<Trip[]> {
    return this.tripRepository.find({ status: StatusTrip.CANCELED });
  }

  async getFinishTrip(): Promise<Trip[]> {
    return this.tripRepository.find({ status: StatusTrip.ARRIVED });
  }

  async getCustomerTrips(customer: string): Promise<Trip[]> {
    return this.tripRepository.find({ customer });
  }
  async cancelCustomerTrip(tripInfo: TripInfoDto): Promise<Trip> {
    const statusTrip = await this.checkTripStatus(tripInfo);
    if (statusTrip === StatusTrip.PENDING) {
      const tripUpdated = await this.tripRepository.findOneAndUpdate(
        { _id: tripInfo.id, customer: tripInfo.customer },
        { status: StatusTrip.CANCELED },
      );
      if (!tripUpdated) {
        throw new NotFoundException('Not Found trip');
      }

      const message = await this.httpService
        .post('http://tracking:3015/api/tracking-trip/update-trip', {
          tripUpdated,
        })
        .pipe(map((response) => response.data));

      this.logger.log(lastValueFrom(message));

      return tripUpdated;
    } else {
      console.log(
        `trip ${tripInfo.id} has invalid status. It can't be canceled from customer `,
      );
      throw new ForbiddenException(
        `trip ${tripInfo.id} has invalid status. It can't be canceled from customer `,
      );
    }
  }
  private async checkTripStatus(tripInfo: TripInfoDto) {
    const trip = await this.tripRepository.findOne({ _id: tripInfo.id });
    if (!trip) {
      throw new NotFoundException('Not Found trip');
    }
    return trip.status;
  }

  async getAllTripsByPhoneNumber(phone: string): Promise<Trip[]> {
    // console.log(phone);
    return this.tripRepository.find({ phone });
  }

  async getTrip(id: string): Promise<Trip> {
    return this.tripRepository.findOne({ _id: id });
  }

  async updateTrip(id: string, request: UpdateTripDto): Promise<Trip> {
    const savedTrip = await this.tripRepository.findOneAndUpdate(
      { _id: id },
      request,
    );

    const message = await this.httpService
      .post('http://tracking:3015/api/tracking-trip/update-trip', { savedTrip })
      .pipe(map((response) => response.data));

    this.logger.log(lastValueFrom(message));

    return savedTrip;
  }

  async deleteAllTrip(): Promise<{ msg: string }> {
    await this.tripRepository.deleteMany({});
    return { msg: 'Delete All the Trip in hotline ' };
  }

  async findTripForTracking(id: string): Promise<Trip> {
    return this.tripRepository.findOne({ _id: id });
  }

  async getUnlocatedTrip(): Promise<Trip[]> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    this.logger.warn(start.toString() + end.toString());

    return this.tripRepository.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
      lat_pickup: { $exists: false },
      long_pickup: { $exists: false },
    });
  }

  async updateTripLocation(updateTripDto: UpdateTripLocationDto) {
    const { id } = updateTripDto;
    const tripUpdated = await this.tripRepository.findOneAndUpdate(
      { _id: id },
      updateTripDto,
    );
    if (!tripUpdated) {
      throw new NotFoundException('Not Found trip');
    }
    const message = await this.httpService
      .post('http://tracking:3015/api/tracking-trip/update-trip', {
        tripUpdated,
      })
      .pipe(map((response) => response.data));

    this.logger.log(lastValueFrom(message));

    return tripUpdated;
  }

  async updateTripStatus(updateTripStatusDto: UpdateTripStatusDto) {
    const { id, status } = updateTripStatusDto;
    const tripUpdated = await this.tripRepository.findOneAndUpdate(
      { _id: id },
      { status },
    );

    if (!tripUpdated.customer) {
      if (tripUpdated.status === 'Picking Up')
        this.smsService.sendMessage("","Tài xế của bạn đang đến!");
      else if (tripUpdated.status === 'Arrived') 
        this.smsService.sendMessage("","Cuốc xe của bạn đã hoàn thành!");
      else if (tripUpdated.status === 'Canceled') 
        this.smsService.sendMessage("","Cuốc xe của bạn đã bị hủy :(");
    }

    const message = await this.httpService
      .post('http://tracking:3015/api/tracking-trip/update-trip', {
        tripUpdated,
      })
      .pipe(map((response) => response.data));

    this.logger.log(lastValueFrom(message));
    return tripUpdated;
  }

  async getAllDriverTrips(id: string) {
    return this.tripRepository.find({ driver: id });
  }

  async getDriverRevenue(id: string) {
    const trips = await this.tripRepository.find({ driver: id });
    const revenue = trips.reduce(
      (acc, trip) => acc + (trip.price - trip.surcharge) * 0.7 + trip.surcharge,
      0,
    );

    return revenue;
  }

  async getDriverRevenueByTime(calculatePriceTripsDto: CalculatePriceTripsDto) {
    const { id_user, startTime, endTime } = calculatePriceTripsDto;

    const trips = await this.tripRepository.find({
      driver: id_user,
      createdAt: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    });

    const totalPrice = trips.reduce((total, trip) => {
      if (trip.price) {
        return total + trip.price;
      } else {
        return total;
      }
    }, 0);

    return { totalPrice };
  }

  async calculatePriceTripsForAdmin(
    calculatePriceTripsDto: CalculatePriceTripsDto,
  ) {
    const { startTime, endTime } = calculatePriceTripsDto;

    const trips = await this.tripRepository.find({
      createdAt: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    });

    const totalPrice = trips.reduce((total, trip) => {
      if (trip.price) {
        return total + trip.price;
      } else {
        return total;
      }
    }, 0);

    return { totalPrice };
  }

  async calculatePriceAllTripsForAdmin() {
    const trips = await this.tripRepository.find({});

    const totalPrice = trips.reduce((total, trip) => {
      if (trip.price) {
        return total + trip.price;
      } else {
        return total;
      }
    }, 0);

    return { totalPrice };
  }

  async statisticDriverByTime(statisticDriverDto: StatisticDriverDto) {
    const { id, username, startTime, endTime } = statisticDriverDto;

    const trips = await this.tripRepository.find({
      driver: id,
      createdAt: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    });

    const totalRevenue = trips.reduce((total, trip) => {
      if (trip.price && trip.status === StatusTrip.ARRIVED) {
        return total + trip.price;
      } else {
        return total;
      }
    }, 0);

    const canceledTrips = trips.reduce((total, trip) => {
      if (trip.status === StatusTrip.CANCELED) {
        return total + trip.price;
      } else {
        return total;
      }
    }, 0);

    const finishedTrips = trips.reduce((total, trip) => {
      if (trip.status === StatusTrip.ARRIVED) {
        return total + trip.price;
      } else {
        return total;
      }
    }, 0);

    return {
      id,
      username,
      totalRevenue,
      canceledTrips,
      finishedTrips,
    };
  }

  async statisticAllDriversByTimeForAdmin(
    statisticAllDriversDto: StatisticAllDriversDto,
  ) {
    const drivers = statisticAllDriversDto.drivers;
    const statisticDrivers = [];
    for (const driver of drivers) {
      const statisticDto = {
        id: driver._id,
        username: driver?.username || null,
        startTime: statisticAllDriversDto.startTime,
        endTime: statisticAllDriversDto.endTime,
      };
      const statistic = await this.statisticDriverByTime(statisticDto);
      statisticDrivers.push(statistic);
    }
    return statisticDrivers;
  }

  //HOTLINE
  async getPointsForHotline(id: string) {
    const trips = await this.tripRepository.find({ hotline: id });
    const totalPoints = trips.reduce((total, trip) => {
      if (trip.price && trip.status === StatusTrip.ARRIVED) {
        return total + trip.price / 1000;
      } else {
        return total;
      }
    }, 0);
    return totalPoints;
  }
}
