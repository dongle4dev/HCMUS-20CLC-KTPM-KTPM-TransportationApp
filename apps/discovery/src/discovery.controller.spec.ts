import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

describe('DiscoveryController', () => {
  let discoveryController: DiscoveryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
      providers: [DiscoveryService],
    }).compile();

    discoveryController = app.get<DiscoveryController>(DiscoveryController);
  });
});
