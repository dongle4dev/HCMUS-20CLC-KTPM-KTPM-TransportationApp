import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { CreateFeedBackDto } from '../../../libs/common/src/dto/feedback/dto/create-feedback.dto';
import { FeedbacksService } from './feedbacks.service';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(
    private readonly feedbacksService: FeedbacksService,
    private readonly rmqService: RmqService,
  ) {}

  //CUSTOMER
  @MessagePattern({ cmd: 'create_feedback_from_customer' })
  createFeedBack(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.createFeedBack(data.createFeedBackDto);
  }

  @MessagePattern({ cmd: 'get_feedbacks_from_customer' })
  getCustomerFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.getCustomerFeedBacks(data.id);
  }

  //DRIVER

  @MessagePattern({ cmd: 'get_feedbacks_from_driver' })
  getDriverFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.getDriverFeedBacks(data.id);
  }

  @MessagePattern({ cmd: 'get_rated_from_driver' })
  getDriverRated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.feedbacksService.getDriverRated(data.id);
  }
  //ADMIN

  @MessagePattern({ cmd: 'get_feedbacks_from_admin' })
  getAdminFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.getAllFeedBacks();
  }

  @EventPattern('delete_feedback_from_admin')
  deleteFeedBack(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.deleteFeedBack(data.id);
  }

  @EventPattern('delete_all_feedbacks_from_admin')
  deleteAllFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.deleteAllFeedBacks();
  }
}
