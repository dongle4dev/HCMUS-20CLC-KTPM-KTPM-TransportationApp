import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'y/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Report } from '../schema/report.schema';

@Injectable()
export class ReportsRepository extends AbstractRepository<Report> {
  protected readonly logger = new Logger(ReportsRepository.name);

  constructor(
    @InjectModel(Report.name) reportModel: Model<Report>,
    @InjectConnection() connection: Connection,
  ) {
    super(reportModel, connection);
  }
}
