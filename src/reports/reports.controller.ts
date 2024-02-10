import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetUser, Roles } from 'src/users/decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { Role } from 'src/users/entities';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Roles(Role.ADMIN)
    @Get()
    async getAllReports() {
        return this.reportsService.getAllReports();
    }

    @Roles(Role.USER)
    @Post()
    async createReport(
        @Body() data: CreateReportDto,
        @GetUser('sub') userId: string
    ): Promise<String> {
        return this.reportsService.createReport(data, userId);
    }

}
