import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepository } from 'y/common/database/notification/repository/notifications.repository';
import { NotificationTokenRepository } from 'y/common/database/notification/repository/notification-token.repository';
import { CreateNotificationDto } from '../../../libs/common/src/dto/notification/dto/create-notification.dto';
import { CreateNotificationTokenDto } from '../../../libs/common/src/dto/notification/dto/create-notification-token.dto';
import { Expo } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private expo = new Expo();
  constructor(
    private readonly notificationRepository: NotificationsRepository,
    private readonly notificationTokenRepository: NotificationTokenRepository,
  ) {}

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

  async createNotificationToken(
    createNotificationTokenDto: CreateNotificationTokenDto,
  ) {
    try {
      const notification =
        await this.notificationTokenRepository.findOneAndUpdate(
          { user: createNotificationTokenDto.user },
          createNotificationTokenDto,
        );
      if (!notification) {
        return await this.notificationTokenRepository.create(
          createNotificationTokenDto,
        );
      }
      return notification;
    } catch (e) {
      return e;
    }
  }

  async sendPush(user: string, title: string, body: string): Promise<void> {
    try {
      const notification_token = await this.notificationTokenRepository.findOne(
        { user },
      );

      if (notification_token) {
        if (!Expo.isExpoPushToken(notification_token.notification_token)) {
          return this.logger.error(
            `Push token ${notification_token} is not a valid Expo push token`,
          );
        }
        const messages = [];
        messages.push({
          to: notification_token.notification_token,
          sound: 'default',
          title,
          body,
        });

        const chunks = this.expo.chunkPushNotifications(messages);
        const tickets = [];
        (async () => {
          for (const chunk of chunks) {
            try {
              const ticketChunk = await this.expo.sendPushNotificationsAsync(
                chunk,
              );
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
            }
          }
        })();

        const receiptIds = [];
        for (const ticket of tickets) {
          if (ticket.id) {
            receiptIds.push(ticket.id);
          }
        }

        const receiptIdChunks =
          this.expo.chunkPushNotificationReceiptIds(receiptIds);
        (async () => {
          for (const chunk of receiptIdChunks) {
            try {
              const receipts = await this.expo.getPushNotificationReceiptsAsync(
                chunk,
              );
              console.log(receipts);

              for (const receiptId in receipts) {
                const { status, details } = receipts[receiptId];
                if (status === 'ok') {
                  continue;
                } else if (status === 'error') {
                  console.error(
                    `There was an error sending a notification: ${details}`,
                  );
                }
              }
            } catch (error) {
              console.error(error);
            }
          }
        })();
      }
    } catch (error) {
      return error;
    }
  }
}
