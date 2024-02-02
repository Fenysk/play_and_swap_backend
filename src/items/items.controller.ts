import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Item } from '@prisma/client';
import { Public } from 'src/auth/decorator/is-public.decorator';
import { GetUser } from 'src/users/decorator';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {

    constructor(private readonly itemsService: ItemsService) { }

    @Public()
    @Get('feed/recent')
    async getRecentFeed(
        @Param('page') page?: number,
        @Param('limit') limit?: number
    ): Promise<Item[]> {
        return this.itemsService.getRecentFeed(page, limit);
    }

    @Post()
    async createNewItem(
        @Body() data: CreateItemDto,
        @GetUser('sub') sellerId: string,
    ): Promise<Item> {
        return this.itemsService.createNewItem(data, sellerId);
    }

    @Delete(':id')
    async deleteItem(
        @Param('id') itemId: string,
        @GetUser('sub') sellerId: string,
    ): Promise<string> {
        return this.itemsService.deleteItem(itemId, sellerId);
    }

    @Put(':id')
    async updateItem(
        @Param('id') itemId: string,
        @Body() data: any,
        @GetUser('sub') sellerId: string,
    ): Promise<Item> {
        return this.itemsService.updateItem(itemId, data, sellerId);
    }



}
