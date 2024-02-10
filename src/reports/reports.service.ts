import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllReports() {
        const reports = await this.prismaService.report.findMany();

        if (!reports.length)
            throw new NotFoundException('No reports found');

        return reports;
    }

    async createReport(data: CreateReportDto, userId: string): Promise<String> {
        const newReport = await this.prismaService.report.create({
            data: {
                userId,
                gameId: data.gameId,
                reason: data.reason,
                message: data.message,
            }
        });

        return 'Your report has been submitted';
    }
}
