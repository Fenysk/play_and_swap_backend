import { Test, TestingModule } from '@nestjs/testing';
import { PriceConverterService } from '../price-converter.service';

describe('ItemsService', () => {
    let priceConverterService: PriceConverterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PriceConverterService],
        }).compile();

        priceConverterService = module.get<PriceConverterService>(PriceConverterService);
    });

    describe('convertToCents', () => {


        it('should return an array of items', () => {
            const expectedResult: number = 3000;

            const priceExample: number = 30;
            const result = priceConverterService.convertToCents(priceExample);

            expect(result).toEqual(expectedResult);
        });

        it('should return error if price is negative', () => {
            const expectedResult = null;

            const priceExample: number = -30;
            const result = priceConverterService.convertToCents(priceExample);

            expect(result).toEqual(expectedResult);
        });

    });


});
