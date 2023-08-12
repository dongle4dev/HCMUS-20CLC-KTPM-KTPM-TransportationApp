import { Injectable } from '@nestjs/common';
import { TripRepository } from 'y/common/database/trip/repository/trip.repository';
import { Trip } from 'y/common/database/trip/schema/trip.schema';
import { CreateTripDto } from './dto/create-trip.dto';
import { SaveOptions } from 'mongoose';

@Injectable()
export class TripService {
  constructor(private readonly tripRepository: TripRepository) {}

  async createTrip(request: CreateTripDto, options?: SaveOptions): Promise<Trip> {
    return this.tripRepository.create(request, options);
  }

  async getAllTrip(): Promise<Trip[]> {
    return this.tripRepository.find({});
  }

  async deleteAllTrip(): Promise<{ msg: string }> {
    await this.tripRepository.deleteMany({});
    return { msg: 'Delete All the Trip in hotline ' };
  }
}
