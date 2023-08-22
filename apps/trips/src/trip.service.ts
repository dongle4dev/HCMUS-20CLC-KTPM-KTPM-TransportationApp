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
import { CreateTripDto, UpdateTripDto, UpdateTripLocationDto, UpdateTripStatusDto, TripInfoDto } from 'y/common';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { StatusTrip } from 'y/common/utils/enum';
import { CalculatePriceTripsDto } from '../../../libs/common/src/dto/calculate-price-trips.dto';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);
  private readonly subject = new Subject();

  constructor(private readonly tripRepository: TripRepository) { }

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
}
