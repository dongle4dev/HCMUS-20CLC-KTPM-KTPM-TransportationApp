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

  async createNotificationToken(createNotificationTokenDto: CreateNotificationTokenDto) {
    try {
      let notification = await this.notificationTokenRepository.findOneAndUpdate({user: createNotificationTokenDto.user}, createNotificationTokenDto);
      if (!notification) {
        return await this.notificationTokenRepository.create(createNotificationTokenDto);
      }
      return notification;
    } catch (e) {
      return e;
    }
  }

  async sendPush(user: string, title: string, body: string): Promise<void> {
    try {
      const notification_token = await this.notificationTokenRepository.findOne({user});

      if (notification_token) {
        if (!Expo.isExpoPushToken(notification_token.notification_token)) {
          return this.logger.error(`Push token ${notification_token} is not a valid Expo push token`);
        }
        let messages = [];
        messages.push({
          to: notification_token.notification_token,
          sound: 'default',
          title,
          body,
        })

        let chunks = this.expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
          for (let chunk of chunks) {
            try {
              let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
            }
          }
        })();

        let receiptIds = [];
        for (let ticket of tickets) {
          if (ticket.id) {
            receiptIds.push(ticket.id);
          }
        }

        let receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(receiptIds);
        (async () => {
          for (let chunk of receiptIdChunks) {
            try {
              let receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);
              console.log(receipts);

              for (let receiptId in receipts) {
                let { status, details } = receipts[receiptId];
                if (status === 'ok') {
                  continue;
                } else if (status === 'error') {
                  console.error(
                    `There was an error sending a notification: ${details}`
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
  };
}
