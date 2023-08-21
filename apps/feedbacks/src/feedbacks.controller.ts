import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { CreateFeedBackDto } from './dto/create-feedback.dto';
import { FeedbacksService } from './feedbacks.service';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(
    private readonly feedbacksService: FeedbacksService,
    private readonly rmqService: RmqService,
  ) {}

  //CUSTOMER
  @Post('/create')
  async createFeedBackTest(@Body() createFeedBackDto: CreateFeedBackDto) {
    return this.feedbacksService.createFeedBack(createFeedBackDto);
  }

  @MessagePattern({ cmd: 'create_feedback_from_customer' })
  createFeedBack(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.createFeedBack(data.createFeedBackDto);
  }

  @Get('/get-customer/:id')
  async getCustomerFeedBacksTest(@Param('id') id: string) {
    return this.feedbacksService.getCustomerFeedBacks(id);
  }

  @MessagePattern({ cmd: 'get_feedbacks_from_customer' })
  getCustomerFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.getCustomerFeedBacks(data.id);
  }

  //DRIVER
  @Get('/get-driver/:id')
  async getDriverFeedBacksTest(@Param('id') id: string) {
    return this.feedbacksService.getDriverFeedBacks(id);
  }

  @MessagePattern({ cmd: 'get_feedbacks_from_driver' })
  getDriverFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.getDriverFeedBacks(data.id);
  }
  //ADMIN
  @Get('/get-all')
  async getAllFeedBacksTest() {
    return this.feedbacksService.getAllFeedBacks();
  }

  @MessagePattern({ cmd: 'get_feedbacks_from_admin' })
  getAdminFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.getAllFeedBacks();
  }

  @Delete('/delete/:id')
  async deleteFeedBackTest(@Param('id') id: string) {
    return this.feedbacksService.deleteFeedBack(id);
  }

  @EventPattern('delete_feedback_from_admin')
  deleteFeedBack(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.deleteFeedBack(data.id);
  }

  @Delete('/delete-all')
  async deleteAllFeedBacksTest() {
    return this.feedbacksService.deleteAllFeedBacks();
  }

  @EventPattern('delete_all_feedbacks_from_admin')
  deleteAllFeedBacks(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);

    return this.feedbacksService.deleteAllFeedBacks();
  }
}
