import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../reports.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Report } from '@prisma/client';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportsService, PrismaService],
    }).compile();

    reportsService = module.get<ReportsService>(ReportsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const reportExample: Report = {
    reportId: 'report-uuid-report-uuid',
    gameId: 'game-uuid-game-uuid',
    userId: 'user-uuid-user-uuid',
    reason: 'reason-uuid-reason-uuid',
    message: 'message-uuid-message-uuid',
    createdAt: new Date(),
  }

  describe('createReport', () => {

    const newReport = {
      gameId: 'game-uuid-game-uuid',
      reason: 'reason message',
      message: 'message bla bla bla',
    }

    it('should return a confirmation message', async () => {
      const expectedResult: String = 'Your report has been submitted';

      const prismaResponse: Report = reportExample;
      prismaService.user.create = jest.fn().mockResolvedValueOnce(prismaResponse);

      const result = await reportsService.createReport(newReport, 'user-uuid-user-uuid');

      expect(result).toEqual(expectedResult);
      expect(prismaService.report.create).toHaveBeenCalled();
    });


  });

});
