import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepository } from 'y/common/database/notification/repository/notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationRepository: NotificationsRepository,
  ) {}

  //CUSTOMER

  getCustomerNotifications(id: string) {
    return this.notificationRepository.find({ customer: id });
  }
  async deleteCustomerNotification(id: string) {
    return this.notificationRepository.delete({ _id: id });
  }
  async deleteAllCustomerNotifications(id: string) {
    try {
      return this.notificationRepository.deleteMany({ customer: id });
    } catch (e) {
      this.logger.error('Error deleted notifications:' + e.message);
    }
  }

  //DRIVER
  createNotification(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.create(createNotificationDto);
  }
}
