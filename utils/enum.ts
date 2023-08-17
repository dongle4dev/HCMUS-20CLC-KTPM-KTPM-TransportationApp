export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum Role {
  ADMIN = 'Admin',
  CUSTOMER = 'Customer',
  DRIVER = 'Driver',
  HOTLINE = 'Hotline',
}
export enum CustomerType {
  REGULAR = 'Regular',
  VIP = 'Vip',
}

export enum roleParam {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  HOTLINE = 'hotline',
}

export enum CapacityVehicle {
  BIKE = 1,
  CAR = 4,
  VAN = 7,
}

export enum StatusDriver {
  BUSY = 'Busy',
  NORMAL = 'Normal',
}

export enum StatusTrip {
  PICKING_UP = 'Picking Up',
  RUNNING = 'Arriving',
  ARRIVED = 'Arrived',
  SEARCHING = 'Searching for drivers',
  CANCELED = 'CANCELED',
}
