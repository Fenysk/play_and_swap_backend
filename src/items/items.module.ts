import { Module } from '@nestjs/common';
import { PriceConverterModule } from 'src/utils/price-converter/price-converter.module';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
    imports: [PriceConverterModule],
    providers: [ItemsService],
    controllers: [ItemsController]
})
export class ItemsModule { }
