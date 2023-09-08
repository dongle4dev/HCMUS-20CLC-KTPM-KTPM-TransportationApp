import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Payment } from '../schema/payment.schema';

@Injectable()
export class PaymentRepository extends AbstractRepository<Payment> {
  protected readonly logger = new Logger(PaymentRepository.name);
  
  constructor(
    @InjectModel(Payment.name) PaymentModel: Model<Payment>,
    @InjectConnection() connection: Connection,
  ) {
    super(PaymentModel, connection);
  }
}
