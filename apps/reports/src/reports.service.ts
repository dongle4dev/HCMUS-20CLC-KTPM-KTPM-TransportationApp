import { Injectable } from '@nestjs/common';
import { ReportsRepository } from 'y/common/database/report/repository/reports.repository';
import { CreateReportDto } from 'y/common/dto/report/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly reportRepository: ReportsRepository) {}

  async createReportFromCustomer(createReportDto: CreateReportDto) {
    const report = await this.reportRepository.create(createReportDto);
    return report;
  }
  async getAllReportsFromAdmin() {
    return this.reportRepository.find({});
  }

  async deleteAllReportsFromAdmin() {
    try {
      await this.reportRepository.deleteMany({});
      return { msg: 'Deleted All reports' };
    } catch (error) {
      // Handle any errors that might occur during the deletion process
      console.error('Error deleting reports:', error);
      throw error; // Rethrow the error or handle it according to your needs
    }
  }
}
