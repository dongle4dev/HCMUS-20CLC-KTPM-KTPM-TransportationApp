import { Injectable } from '@nestjs/common';
import { FeedBacksRepository } from 'y/common/database/feedback/repository/feedbacks.repository';
import { CreateFeedBackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(private readonly feedbackRepository: FeedBacksRepository) {}
  getHello(): string {
    return 'Hello World!';
  }

  //CUSTOMER
  async getCustomerFeedBacks(id: string) {
    return this.feedbackRepository.find({ customer: id });
  }
  async createFeedBack(createFeedBackDto: CreateFeedBackDto) {
    return this.feedbackRepository.create(createFeedBackDto);
  }

  //DRIVER
  async getDriverFeedBacks(id: string) {
    return this.feedbackRepository.find({ driver: id });
  }

  //ADMIN
  async getAllFeedBacks() {
    return this.feedbackRepository.find({});
  }
  async deleteFeedBack(id: string) {
    await this.feedbackRepository.delete({ _id: id });
    return { msg: `Delete feedback ${id} successful` };
  }
  async deleteAllFeedBacks() {
    await this.feedbackRepository.deleteMany({});
    return { msg: 'Deleted all feedback' };
  }
}
