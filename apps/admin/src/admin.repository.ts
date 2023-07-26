import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Admin } from './schema/admin.schema';

@Injectable()
export class AdminRepository extends AbstractRepository<Admin> {
  protected readonly logger = new Logger(AdminRepository.name);

  constructor(
    @InjectModel(Admin.name) adminModel: Model<Admin>,
    @InjectConnection() connection: Connection,
  ) {
    super(adminModel, connection);
  }
}
