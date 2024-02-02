import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PriceConverterService } from 'src/utils/price-converter/price-converter.service';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly priceConverterService: PriceConverterService,
    ) { }

    async getRecentFeed(page: number = 1, limit: number = 10) {
        const items = await this.prismaService.item.findMany({
            where: {
                isVisible: true,
                isSold: false,
            },
            include: {
                Platform: true,
                Seller: { select: { Profile: true }, },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        if (!items.length)
            throw new NotFoundException(`No items found`);

        return items;
    }

    async createNewItem(data: CreateItemDto, sellerId: string) {

        const {
            platformId,
            price,
            title,
            edition,
            region,
            imageUrl,
            hasGame,
            stateGame,
            hasBox,
            stateBox,
            hasManual,
            stateManual,
            hasCover,
            stateCover,
            extraContent,
            isVisible,
        } = data;

        const sellerPrice = this.priceConverterService.convertToCents(price);

        const newItem = await this.prismaService.item.create({
            data: {
                sellerPrice,
                title,
                edition,
                region,
                imageUrl,
                hasGame,
                stateGame,
                hasBox,
                stateBox,
                hasManual,
                stateManual,
                hasCover,
                stateCover,
                extraContent,
                isVisible,
                Platform: {
                    connect: { platformId }
                },
                Seller: {
                    connect: { userId: sellerId }
                },
            }
        });

        return newItem;
    }

    async deleteItem(itemId: string, sellerId: string) {
        const item = await this.prismaService.item.findUnique({
            where: { gameId: itemId },
            select: { sellerId: true, title: true },
        });

        if (!item || item.sellerId !== sellerId)
            throw new NotFoundException(`Item not found`);

        await this.prismaService.item.delete({
            where: { gameId: itemId }
        });

        return `Item ${item.title} deleted !`;
    }

    async updateItem(itemId: string, data: any, sellerId: string) {
        const item = await this.prismaService.item.findUnique({
            where: { gameId: itemId },
            select: { sellerId: true, title: true },
        });

        if (!item || item.sellerId !== sellerId)
            throw new NotFoundException(`Item not found`);

        const updatedItem = await this.prismaService.item.update({
            where: { gameId: itemId },
            data: data
        });

        return updatedItem;
    }

}
