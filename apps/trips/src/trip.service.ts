import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Subject } from 'rxjs';
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

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(private readonly tripRepository: TripRepository) {}

  async createTrip(createTripDto: any) {
    const trip = await this.tripRepository.create(createTripDto);

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
    return this.tripRepository.findOneAndUpdate({ _id: id }, request );
  }

  async deleteAllTrip(): Promise<{ msg: string }> {
    await this.tripRepository.deleteMany({});
    return { msg: 'Delete All the Trip in hotline ' };
  }

  async findTripForTracking(id: string): Promise<Trip> {
    return this.tripRepository.findOne({ _id: id });
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
    console.log(tripUpdated);
    return tripUpdated;
  }

  async updateTripStatus(updateTripStatusDto: UpdateTripStatusDto) {
    const { id, status } = updateTripStatusDto;
    const tripUpdated = await this.tripRepository.findOneAndUpdate(
      { _id: id },
      { status },
    );
    return tripUpdated;
  }

  async getAllDriverTrips(id: string) {
    return this.tripRepository.find({ driver: id });
  }

  async getDriverRevenue(id: string) {
    const trips = await this.tripRepository.find({ driver: id });
    const revenue = trips.reduce((acc, trip) => acc + trip.price, 0);
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

    const totalPrice = trips.reduce((total, trip) => total + trip.price, 0);

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

    const totalPrice = trips.reduce((total, trip) => total + trip.price, 0);

    return { totalPrice };
  }

  async calculatePriceAllTripsForAdmin() {
    const trips = await this.tripRepository.find({});

    const totalPrice = trips.reduce((total, trip) => total + trip.price, 0);

    return { totalPrice };
  }
}
