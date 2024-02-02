import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
    constructor(private readonly prisma: PrismaService) { }

    async getRecentFeed(page: number = 1, limit: number = 10) {
        const items = await this.prisma.item.findMany({
            where: {
                isVisible: true,
                isSold: false,
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
}
