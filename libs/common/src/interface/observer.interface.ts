import { DriverPositionDto } from '../dto/driver-location';

export interface Observer {
  update(driverPositionDto: DriverPositionDto): void;
}
