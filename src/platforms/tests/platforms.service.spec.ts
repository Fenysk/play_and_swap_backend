import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Platform } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlatformDto } from '../dto/create-platform.dto';
import { PlatformsService } from '../platforms.service';

describe('PlatformsService', () => {
    let service: PlatformsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PlatformsService, PrismaService],
        }).compile();

        service = module.get<PlatformsService>(PlatformsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    const platformExample: Platform = {
        platformId: 'uuid-uuid-uuid-uuid',

        name: 'Nintendo 64',
        releaseDate: new Date('1996-06-23'),
        manufacturer: 'NINTENDO',
        generation: 5,

        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/N64-Console-Set.png',
    }

    describe('getAllPlatforms', () => {

        it('should return an array of platforms', async () => {
            const expectedResult: Platform[] = [platformExample, platformExample];

            const prismaResponse: Platform[] = [platformExample, platformExample];
            prismaService.platform.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = await service.getAllPlatforms();
            expect(result).toEqual(expectedResult);
            expect(prismaService.platform.findMany).toHaveBeenCalled();
        });


        it('should throw NotFoundException if no platforms found', () => {
            const prismaResponse: Platform[] = [];
            prismaService.platform.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = service.getAllPlatforms();

            expect(result).rejects.toThrow();
            expect(prismaService.platform.findMany).toHaveBeenCalled();
        });

    });


    describe('addPlatform', () => {

        const newPlatform: CreatePlatformDto = {
            name: 'Nintendo 64',
            releaseDate: new Date('1996-06-23'),
            manufacturer: 'NINTENDO',
            generation: 5,
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/N64-Console-Set.png',
        };

        it('should add a platform', async () => {
            const expectedResult: Platform = platformExample;

            const prismaResponse: Platform = platformExample;
            prismaService.platform.create = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = await service.addPlatform(newPlatform);

            expect(result).toEqual(expectedResult);
            expect(prismaService.platform.create).toHaveBeenCalled();
        });


        it('should throw ConflictException if already exists', () => {
            const prismaResponse: ConflictException = new ConflictException();
            prismaService.platform.create = jest.fn().mockRejectedValueOnce(prismaResponse);

            const result = service.addPlatform(newPlatform);

            expect(result).rejects.toThrow(ConflictException);
            expect(prismaService.platform.create).toHaveBeenCalled();
        });

    });


    describe('deletePlatform', () => {

        it('should delete a platform', async () => {
            const expectedResult: String = `Platform ${platformExample.name} deleted !`;

            const prismaFindUniqueResponse: Platform = platformExample;
            prismaService.platform.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);

            const prismaDeleteResponse: Platform = platformExample;
            prismaService.platform.delete = jest.fn().mockResolvedValueOnce(prismaDeleteResponse);


            const result = await service.deletePlatform(platformExample.platformId);

            expect(result).toEqual(expectedResult);
            expect(prismaService.platform.findUnique).toHaveBeenCalled();
            expect(prismaService.platform.delete).toHaveBeenCalled();
        });


        it('should throw NotFoundException if no platform found', () => {
            const expectedResult: NotFoundException = new NotFoundException('No platform found');

            const prismaResponse: Platform = null;
            prismaService.platform.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = service.deletePlatform(platformExample.platformId);

            expect(result).rejects.toThrow(NotFoundException);
            expect(prismaService.platform.findUnique).toHaveBeenCalled();
        });

    });


});
