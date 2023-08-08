import { DriverPositionDto } from '../dto/DriverPosition.dto';
import { calculateDistance } from './calculate';

export function findDriversWithinRadius(
  customerCoordinates: {
    lat: number;
    lng: number;
  },
  broadcastRadius: number,
  drivers: DriverPositionDto[],
): DriverPositionDto[] {
  // Lọc các driver nằm trong bán kính xung quanh tọa độ của khách hàng
  const driversWithinRadius = drivers.filter((driver) => {
    const distance = calculateDistance(
      customerCoordinates.lat,
      customerCoordinates.lng,
      driver.lat,
      driver.lng,
    );
    console.log(distance);
    return distance <= broadcastRadius;
  });

  return driversWithinRadius;
}
