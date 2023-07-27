import { Injectable } from '@nestjs/common';
import { DemandRepository } from './demand.repository';

@Injectable()
export class DemandService {
  constructor(private readonly demandRepository: DemandRepository) {}
}
