import { Injectable } from '@nestjs/common';
import { DemandRepository } from 'y/common/database/discovery/demand/repository/demand.repository';

@Injectable()
export class DemandService {
  constructor(private readonly demandRepository: DemandRepository) {}
}
