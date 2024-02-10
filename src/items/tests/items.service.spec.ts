import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PriceConverterService } from 'src/utils/price-converter/price-converter.service';
import { CreateItemDto } from '../dto/create-item.dto';
import { ItemsService } from '../items.service';

describe('ItemsService', () => {
    let itemsService: ItemsService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ItemsService, PrismaService, PriceConverterService],
        }).compile();

        itemsService = module.get<ItemsService>(ItemsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    const itemExample = {
        gameId: 'uuid_game-uuid_game',
        platformId: 'uuid_platform-uuid_platform',
        Platform: {
            name: 'Nintendo 64',
            generation: 5,
        },

        sellerId: 'uuid_user-uuid_user',
        Seller: {
            Profile: {
                userId: 'uuid_user-uuid_user',
                displayName: 'Maité'
            }
        },
        sellerPrice: 3000,

        title: 'Super Mario 64',
        edition: 'Standard',
        region: 'PAL',
        imageUrl: 'https://image.jeuxvideo.com/images/64/s/m/sm64640f.jpg',

        hasGame: true,
        stateGame: 'MINT',
        hasBox: true,
        stateBox: 'BAD',
        hasManual: false,
        stateManual: null,
        hasCover: false,
        stateCover: null,

        extraContent: ['Stickers'],

        isVisible: true,
        isSold: false,

        views: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    describe('getRecentFeed', () => {

        it('should return an array of items', async () => {
            const expectedResult = [itemExample, itemExample];

            const prismaResponse = [itemExample, itemExample];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = await itemsService.getRecentFeed();

            expect(result).toEqual(expectedResult);
            expect(result[0].Seller.Profile.displayName).toEqual('Maité');
            expect(result[0].Platform.name).toEqual('Nintendo 64');
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });


        it('should throw 404 error', () => {
            const prismaResponse = [];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = itemsService.getRecentFeed();

            expect(result).rejects.toThrow();
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });

    });


    describe('getItemsBySellerId', () => {

        it('should return an array of items', async () => {
            const expectedResult = [itemExample, itemExample];

            const prismaResponse = [itemExample, itemExample];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await itemsService.getItemsBySellerId('uuid_user-uuid_user');

            expect(result).toEqual(expectedResult);
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });

        it('should return a limited array of items', async () => {
            const prismaResponse = [itemExample, itemExample];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await itemsService.getItemsBySellerId('uuid_user-uuid_user', 2, 2);

            expect(result).toHaveLength(2);
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });

        it('should throw 404 error', () => {
            const prismaResponse = [];
            prismaService.item.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = itemsService.getItemsBySellerId('uuid_user-uuid_user');

            expect(result).rejects.toThrow();
            expect(prismaService.item.findMany).toHaveBeenCalled();
        });

    });


    describe('getItemById', () => {

        it('should return the item', async () => {
            const expectedResult = itemExample;

            const prismaResponse = itemExample;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await itemsService.getItemById('uuid_item-uuid_item');

            expect(result).toEqual(expectedResult);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
        });


        it('should throw 404 error', () => {
            const expectedError = new NotFoundException('Item not found');

            const prismaResponse: Item = null;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = itemsService.getItemById('uuid_item-uuid_item');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
        });

    });


    describe('createNewItem', () => {

        const newItem: CreateItemDto = {
            platformId: 'uuid_platform-uuid_platform',
            price: 30,
            title: 'Super Mario 64',
            region: 'PAL',
            imageUrl: 'https://image.jeuxvideo.com/images/64/s/m/sm64640f.jpg',
            hasGame: true,
            stateGame: 'GOOD',
            hasBox: true,
            stateBox: 'BAD',
            extraContent: ['Stickers']
        }

        it('should return the created item', async () => {
            const expectedResult = itemExample;

            const prismaResponse = itemExample;
            prismaService.item.create = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await itemsService.createNewItem(newItem, 'uuid_user-uuid_user');

            expect(result).toEqual(expectedResult);
            expect(prismaService.item.create).toHaveBeenCalled();
        });


        it('should throw error if fields are missing', () => {
            const prismaResponse: Error = new Error();
            prismaService.item.create = jest.fn().mockRejectedValueOnce(prismaResponse);

            const result = itemsService.createNewItem({
                ...newItem,
                title: '',
            }, 'uuid_user-uuid_user');

            expect(result).rejects.toThrow();
        });

    });


    describe('deleteItem', () => {

        it('should return confirmation delete', async () => {
            const expectedResult = 'Item Super Mario 64 deleted !';

            const prismaFindUniqueResponse = itemExample;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);

            const prismaDeleteResponse = itemExample;
            prismaService.item.delete = jest.fn().mockResolvedValueOnce(prismaDeleteResponse);


            const result = await itemsService.deleteItem('uuid_item-uuid_item', 'uuid_user-uuid_user');

            expect(result).toEqual(expectedResult);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
            expect(prismaService.item.delete).toHaveBeenCalled();
        });

        it('should throw error if item not found', () => {
            const expectedError = new NotFoundException('Item not found');

            const prismaFindUniqueResponse: Item = null;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);


            const result = itemsService.deleteItem('uuid_item-uuid_item', 'uuid_user-uuid_user');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
        });

        it('should throw error if user is not the owner', () => {
            const expectedError = new NotFoundException('Item not found');

            const prismaFindUniqueResponse = itemExample;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);


            const result = itemsService.deleteItem('uuid_item-uuid_item', 'uuid_other_user-uuid_other_user');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
        });

    });


    describe('updateItem', () => {

        const updatedItemExample = {
            gameId: 'uuid_game-uuid_game',
            platformId: 'uuid_platform-uuid_platform',
            Platform: {
                name: 'Nintendo 64',
                generation: 5,
            },

            sellerId: 'uuid_user-uuid_user',
            Seller: {
                Profile: {
                    userId: 'uuid_user-uuid_user',
                    displayName: 'Maité'
                }
            },
            sellerPrice: 3000,

            title: 'Super Mario 64',
            edition: 'Standard',
            region: 'PAL',
            imageUrl: 'https://image.jeuxvideo.com/images/64/s/m/sm64640f.jpg',

            hasGame: true,
            stateGame: 'MINT',
            hasBox: true,
            stateBox: 'BAD',
            hasManual: false,
            stateManual: null,
            hasCover: false,
            stateCover: null,

            extraContent: ['Stickers'],

            isVisible: false,
            isSold: false,

            views: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        it('should return the updated item', async () => {
            const prismaFindUniqueResponse = itemExample;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);

            const prismaUpdateResponse = updatedItemExample;
            prismaService.item.update = jest.fn().mockResolvedValueOnce(prismaUpdateResponse);

            const result = await itemsService.updateItem(
                'uuid_item-uuid_item',
                { isVisible: false },
                'uuid_user-uuid_user'
            );

            expect(result.isVisible).toEqual(false);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
            expect(prismaService.item.update).toHaveBeenCalled();
        });

        it('should throw error if item not found', () => {
            const expectedError = new NotFoundException('Item not found');

            const prismaResponse: Item = null;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = itemsService.updateItem(
                'uuid_item-uuid_item',
                { isVisible: false },
                'uuid_user-uuid_user'
            );

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
        });

    });

    describe('declareItemAsSold', () => {

        it('should return the updated item', async () => {
            const expectedResult = 'Item Super Mario 64 declared as sold !';

            const prismaFindUniqueResponse = itemExample;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);

            const prismaUpdateResponse = { ...itemExample, isSold: true };
            prismaService.item.update = jest.fn().mockResolvedValueOnce(prismaUpdateResponse);

            const result = await itemsService.declareItemAsSold('uuid_item-uuid_item', 'uuid_user-uuid_user');

            expect(result).toEqual(expectedResult);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
            expect(prismaService.item.update).toHaveBeenCalled();
        });

        it('should throw error if item not found', () => {
            const expectedError = new NotFoundException('Item not found');

            const prismaResponse: Item = null;
            prismaService.item.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = itemsService.declareItemAsSold('uuid_item-uuid_item', 'uuid_user-uuid_user');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.item.findUnique).toHaveBeenCalled();
        });

    });

});
