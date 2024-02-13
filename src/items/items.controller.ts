import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Item } from '@prisma/client';
import { Public } from 'src/auth/decorator/is-public.decorator';
import { GetUser, Roles } from 'src/users/decorator';
import { Role } from 'src/users/entities';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {

    constructor(private readonly itemsService: ItemsService) { }

    @Public()
    @Get('feed/recent')
    async getRecentFeed(
        @Query('page', ParseIntPipe) page?: number,
        @Query('limit', ParseIntPipe) limit?: number
    ): Promise<Item[]> {
        return this.itemsService.getRecentFeed(page, limit);
    }

    @Public()
    @Get('seller/:id')
    async getItemsBySellerId(
        @Param('id') sellerId: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('limit', ParseIntPipe) limit?: number
    ): Promise<Item[]> {
        return this.itemsService.getItemsBySellerId(sellerId, page, limit);
    }

    @Public()
    @Get('pseudo/:pseudo')
    async getItemsBySellerPseudo(
        @Param('pseudo') pseudo: string,
        @Query('page', ParseIntPipe) page?: number,
        @Query('limit', ParseIntPipe) limit?: number
    ): Promise<Item[]> {
        return this.itemsService.getItemsBySellerPseudo(pseudo, page, limit);
    }

    @Public()
    @Get(':id')
    async getItemById(@Param('id') itemId: string): Promise<Item> {
        return this.itemsService.getItemById(itemId);
    }

    @Roles(Role.SELLER)
    @Post()
    async createNewItem(
        @Body() data: CreateItemDto,
        @GetUser('sub') sellerId: string,
    ): Promise<Item> {
        return this.itemsService.createNewItem(data, sellerId);
    }

    @Roles(Role.SELLER)
    @Delete(':id')
    async deleteMyItem(
        @Param('id') itemId: string,
        @GetUser('sub') sellerId: string,
    ): Promise<string> {
        return this.itemsService.deleteItem(itemId, sellerId);
    }

    @Roles(Role.ADMIN)
    @Delete(':id/admin')
    async deleteItemByAdmin(
        @Param('id') itemId: string,
    ): Promise<string> {
        return this.itemsService.deleteItemByAdmin(itemId);
    }

    @Roles(Role.SELLER)
    @Put(':id')
    async updateMyItem(
        @Param('id') itemId: string,
        @Body() data: any,
        @GetUser('sub') sellerId: string,
    ): Promise<Item> {
        return this.itemsService.updateItem(itemId, data, sellerId);
    }

    @Roles(Role.SELLER)
    @Put(':id/sold')
    async declareItemAsSold(
        @Param('id') itemId: string,
        @GetUser('sub') sellerId: string,
    ): Promise<string> {
        return this.itemsService.declareItemAsSold(itemId, sellerId);
    }



}
