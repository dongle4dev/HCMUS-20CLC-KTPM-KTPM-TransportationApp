import axios from 'axios';

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
  endLat: string,
  endLong: string,
) {
  try {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY; // Khóa API Google Maps
    const currentTime = new Date();
    const isPeakHour =
      currentTime.getHours() >= 7 && currentTime.getHours() <= 9; // Giả định cao điểm từ 7h - 9h

    // Lấy thông tin thời tiết
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${startLat}&lon=${startLong}&appid=${weatherApiKey}`,
    );
    const weatherCondition = weatherResponse.data.weather[0].main; // Ví dụ: 'Clear', 'Rain', ...
    // Lấy thông tin thời gian di chuyển
    const travelResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${startLat},${startLong}&destinations=${endLat},${endLong}&key=${googleMapsApiKey}`,
    );
    const travelDuration =
      travelResponse.data.rows[0].elements[0].duration.value; // Đơn vị giây

    // Tính giá tiền dựa trên các yếu tố
    let basePrice = 10; // Giá cơ bản
    if (weatherCondition === 'Rain' || weatherCondition === 'Snow') {
      basePrice += 5; // Phụ thu cho thời tiết xấu
    }
    if (isPeakHour) {
      basePrice *= 1.5; // Phụ thu giờ cao điểm
    }
    const distanceInKm = travelDuration / 60 / 60; // Đổi giây sang giờ
    const distanceBasedCharge = distanceInKm * 2; // Giá cơ bản dựa trên khoảng cách

    const totalCost = basePrice + distanceBasedCharge;
    return totalCost;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}
