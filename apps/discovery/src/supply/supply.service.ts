import { Injectable } from '@nestjs/common';
import { SupplyRepository } from './supply.repository';

@Injectable()
export class SupplyService {
  constructor(private readonly supplyRepository: SupplyRepository) {}
}
