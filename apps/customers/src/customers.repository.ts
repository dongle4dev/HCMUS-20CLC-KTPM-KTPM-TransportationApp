import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Customer } from './schema/customer.schema';

@Injectable()
export class CustomersRepository extends AbstractRepository<Customer> {
  protected readonly logger = new Logger(CustomersRepository.name);

  constructor(
    @InjectModel(Customer.name) customerModel: Model<Customer>,
    @InjectConnection() connection: Connection,
  ) {
    super(customerModel, connection);
  }
}
