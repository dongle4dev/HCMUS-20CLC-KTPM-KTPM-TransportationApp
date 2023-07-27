import { Injectable } from '@nestjs/common';
import { DiscoveryRepository } from './discovery.repository';

@Injectable()
export class DiscoveryService {
  constructor(private readonly discoveryRepository: DiscoveryRepository) {}
  getHello(): string {
    return 'Hello World!';
  }
}
