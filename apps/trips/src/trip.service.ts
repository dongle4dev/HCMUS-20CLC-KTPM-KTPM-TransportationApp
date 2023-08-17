import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Subject } from 'rxjs';
import { UpdateTripLocationDto } from 'apps/hotlines/src/dto/update-trip.dto';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { StatusTrip } from 'utils/enum';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);
  private readonly subject = new Subject();

  constructor(private readonly tripRepository: TripRepository) {}

  async createTrip(createTripDto: any) {
    this.logger.log('create trip');
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

  async getAllTripsByPhoneNumber(phone: string): Promise<Trip[]> {
    // console.log(phone);
    return this.tripRepository.find({ phone });
  }

  async updateTrip(id: string, request: UpdateTripDto): Promise<Trip> {
    return this.tripRepository.findOneAndUpdate({ id }, { request });
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

  async getDriverRevenueByWeek(id: string, week: number) {
    return null;
  }

  async getDriverRevenueByMonth(id: string, month: number) {
    return null;
  }
}
