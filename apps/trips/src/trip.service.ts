import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Subject } from 'rxjs';

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

  async getAllTrip(): Promise<Trip[]> {
    return this.tripRepository.find({});
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

  async updateTripStatus(data: any) {
    return null;
  }
}
