import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { CreateReportDto } from 'y/common/dto/report/create-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'create_report_from_customer' })
  createReportFromCustomer(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.reportsService.createReportFromCustomer(data.createReportDto);
  }

  @MessagePattern({ cmd: 'get_reports_from_admin' })
  getAllReportsFromAdmin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.reportsService.getAllReportsFromAdmin();
  }

  @EventPattern('delete_all_reports_from_admin')
  deleteAllReportsFromAdmin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.reportsService.getAllReportsFromAdmin();
  }

  @Post('create')
  createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.createReportFromCustomer(createReportDto);
  }

  @Get('get-all')
  getAll() {
    return this.reportsService.getAllReportsFromAdmin();
  }

  @Delete('delete-all')
  deleteAllReports() {
    return this.reportsService.deleteAllReportsFromAdmin();
  }
}
