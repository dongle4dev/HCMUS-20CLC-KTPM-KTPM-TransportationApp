import axios from 'axios';
import { CapacityVehicle } from './enum';

// Phương thức tính khoảng cách giữa hai điểm dựa vào công thức Haversine
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const earthRadius = 6371; // Bán kính trái đất (đơn vị: km)

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance; // km
}

// Hàm chuyển đổi độ sang radian
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

//Distance Matrix google api
export async function calculateDistanceAPI(
  lat1: string,
  long1: string,
  lat2: string,
  long2: string,
): Promise<string> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${long1}&destinations=${lat2},${long2}&key=${apiKey}`;
  console.log(url);
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      const distanceText = data.rows[0].elements[0].distance.text;
      return distanceText;
    } else {
      throw new Error('Error calculating distance');
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

export async function calculateDistanceGoong(oriLat, oriLng, desLat, desLng, vehicle) {
  try {
    const apiKey = process.env.GOONG_APIKEY;
    const url = `https://rsapi.goong.io/DistanceMatrix?origins=${oriLat},${oriLng}&destinations=${desLat},${desLng}&vehicle=${vehicle}&api_key=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data.rows[0].elements[0];
    
    if (data.status === "OK") {
      const distance = data.distance.value / 1000;

      return distance;
    } else {
      return { msg: "Not found" };
    }

  } catch (error) {
    return error.message;
  }
};
// Distance Matrix
// Các giá trị mode: 'walking', 'transit', 'bicycling', 'driving'
export async function getTravelTime(
  lat1: string,
  long1: string,
  lat2: string,
  long2: string,
  mode: string,
) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${long1}&destinations=${lat2},${long2}&mode=${mode}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      const durationText = data.rows[0].elements[0].duration.text;
      return durationText;
    } else {
      throw new Error('Error calculating travel time');
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

export async function calculateTripCost(
  startLat: string,
  startLong: string,
  distance: number,
  mode: CapacityVehicle, // (1,4,7)
  basePrices: any,
  pricePerKilometer: any,
  startTimePeakHour: number,
  endTimePeakHour: number,
  surchargeIndexLevel1: number,
  surchargeIndexLevel2: number,
) {
  if (!(mode in basePrices)) {
    throw new Error('Invalid mode');
  }
  try {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const currentTime = new Date();
    const isPeakHour =
      currentTime.getHours() >= startTimePeakHour &&
      currentTime.getHours() <= endTimePeakHour; // Giả định cao điểm từ 7h - 9h

    // Lấy thông tin thời tiết
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${startLat}&lon=${startLong}&appid=${weatherApiKey}`,
    );
    const weatherCondition = weatherResponse.data.weather[0].main; // Ví dụ: 'Clear', 'Rain', Thunderstorm, Mist, Fog, Smoke, Haze, Tornado, Drizzle...
    // Tính giá tiền dựa trên các yếu tố
    const basePrice = basePrices[mode]; // Giá cơ bản
    // console.log('Base Price: ', basePrice);
    let additionalCharge = 0;
    // console.log('Distance: ', distance);
    if (distance <= 10 && distance >= 2) {
      additionalCharge = distance * pricePerKilometer[mode].upTo10Km;
    } else if (distance > 10) {
      additionalCharge =
        10 * pricePerKilometer[mode].upTo10Km +
        (distance - 10) * pricePerKilometer[mode].after10Km;
    }
    // console.log('Additional: ', additionalCharge);
    let totalCost = basePrice + additionalCharge;
    const price = totalCost; // Giá tiền khi chưa có thụ phí
    let surcharge = 0;
    // console.log('First total: ', totalCost);
    if (
      (weatherCondition === 'Rain' || weatherCondition === 'Snow') &&
      isPeakHour
    ) {
      totalCost *= surchargeIndexLevel2 + 0.3; // Phụ thu cho thời tiết xấu, giờ cao điểm
      surcharge = totalCost - price;
      return {
        totalCost,
        surcharge,
        weatherCondition,
        currentTime: currentTime.getHours(),
        reason: `Phụ thu cho thời tiết xấu, giờ cao điểm`,
      };
    } else if (weatherCondition === 'Rain' || weatherCondition === 'Snow') {
      totalCost *= surchargeIndexLevel1; // Phụ thu cho thời tiết xấu
      surcharge = totalCost - price;
      return {
        totalCost,
        surcharge,
        weatherCondition,
        currentTime: currentTime.getHours(),
        reason: `Phụ thu cho thời tiết xấu`,
      };
    } else if (isPeakHour) {
      totalCost *= surchargeIndexLevel1; // Phụ thu cho giờ cao điểm
      surcharge = totalCost - price;
      return {
        totalCost,
        surcharge,
        weatherCondition,
        currentTime: currentTime.getHours(),
        reason: 'Phụ thu cho giờ cao điểm',
      };
    } else {
      return {
        totalCost,
        surcharge,
        weatherCondition,
        currentTime: currentTime.getHours(),
        reason: 'Không có phụ thu',
      };
    }
    // console.log('Total: ', totalCost);
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
