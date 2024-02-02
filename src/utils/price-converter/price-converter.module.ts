import { Module } from '@nestjs/common';
import { PriceConverterService } from './price-converter.service';

@Module({
    providers: [PriceConverterService],
    exports: [PriceConverterService],
})
export class PriceConverterModule { }
