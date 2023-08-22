import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly rmqService: RmqService,
  ) {}

  //Customer
  @MessagePattern({ cmd: 'get_notifications_from_customer' })
  getCustomerNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.notificationsService.getCustomerNotifications(data.id);
  }

  @EventPattern('delete_notification_from_customer')
  deleteCustomerNotification(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.notificationsService.deleteCustomerNotification(data.id);
  }

  @EventPattern('delete_all_notifications_from_customer')
  deleteAllCustomerNotifications(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.notificationsService.deleteAllCustomerNotifications(data.id);
  }

  //DRIVER
  @MessagePattern({ cmd: 'create_notification_from_driver' })
  createNotification(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.notificationsService.createNotification(
      data.createNotificationDto,
    );
  }
}
