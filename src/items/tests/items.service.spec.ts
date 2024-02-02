import { Test, TestingModule } from '@nestjs/testing';
import { Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemsService } from '../items.service';

describe('ItemsService', () => {
    let itemsService: ItemsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ItemsService, PrismaService],
        }).compile();

        itemsService = module.get<ItemsService>(ItemsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    const itemExample: Item = {
        gameId: 'uuid-uuid-uuid-uuid',
        platformId: 'uuid2-uuid2-uuid2-uuid2',

        sellerId: 'uuid3-uuid3-uuid3-uuid3',
        sellerPrice: 30,

        title: 'Super Mario 64',
        edition: 'Standard',
        region: 'PAL',
        imageUrl: 'https://image.jeuxvideo.com/images/64/s/m/sm64640f.jpg',

        hasGame: true,
        stateGame: 'MINT',
        hasBox: true,
        stateBox: 'AVERAGE',
        hasManual: false,
        stateManual: null,
        hasCover: true,
        stateCover: 'GOOD',

        extraContent: ['Stickers'],

        isVisible: true,
        isSold: false,

        views: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    describe('getRecentFeed', () => {

        it('should return an array of items', () => {
            const expectedResult: Item[] = [itemExample, itemExample];

            const prismaResponse: Item[] = [itemExample, itemExample];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = itemsService.getRecentFeed();

            expect(result).resolves.toEqual(expectedResult);
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });


        it('should throw 404 error', () => {
            const prismaResponse: Item[] = [];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = itemsService.getRecentFeed();

            expect(result).rejects.toThrow();
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });

    });

});
