import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsRepository } from 'y/common/database/report/repository/reports.repository';
import { ReportSchema } from 'y/common/database/report/schema/report.schema';
import { RmqModule } from 'y/common/rmq/rmq.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_REPORT_QUEUE: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
    RmqModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
