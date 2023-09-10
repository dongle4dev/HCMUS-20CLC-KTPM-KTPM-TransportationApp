import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { DriverPositionDto } from 'y/common/dto/driver-location';
import { calculateDistanceGoong } from './calculate';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function findDriversWithinRadius(
  lat, long, broadcastRadius, vehicle,
  drivers: DriverPositionDto[],
): Promise<DriverPositionDto[]> {
  let driversWithinRadius = [];
  if (drivers) {
    for (let driver of drivers) {
      const distance = await calculateDistanceGoong(
        lat, long,
        driver.latitude,
        driver.longitude,
        vehicle
      );
      console.log(distance);

      if (distance <= broadcastRadius) driversWithinRadius.push(driver);
    }

    console.log("Driver within radius ", broadcastRadius, " is ", driversWithinRadius);
    return driversWithinRadius;
  } else {
    console.log("Don't have any drivers to broadcast");
  }
}
