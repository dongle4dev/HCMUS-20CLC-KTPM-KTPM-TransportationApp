import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { calculateDistance } from './calculate';

export function findDriversWithinRadius(
  customerPositionDto: CustomerPositionDto,
  drivers: DriverPositionDto[],
): DriverPositionDto[] {
  if (drivers !== null) {
    // Lọc các driver nằm trong bán kính xung quanh tọa độ của khách hàng
    const driversWithinRadius = drivers.filter((driver) => {
      const distance = calculateDistance(
        customerPositionDto.latitude,
        customerPositionDto.longitude,
        driver.latitude,
        driver.longitude,
      );
      console.log(distance);
      return distance <= customerPositionDto.broadcastRadius;
    });

    return driversWithinRadius;
  } else {
    console.log("Don't have any drivers to broadcast");
  }
}
