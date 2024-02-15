import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

@Injectable()
export class PlatformsService {
    constructor(private readonly prismaService: PrismaService) { }

    async getAllPlatforms(): Promise<Platform[]> {
        const platforms = await this.prismaService.platform.findMany({
            include: {
                Items: true
            }
        });

        if (!platforms.length)
            throw new NotFoundException('No platforms found');

        return platforms;
    }

    async addPlatform(data: CreatePlatformDto): Promise<Platform> {
        const newPlatform = await this.prismaService.platform.create({ data });

        return newPlatform;
    }

    async deletePlatform(platformId: string): Promise<string> {
        const platform = await this.prismaService.platform.findUnique({
            where: { platformId },
            select: {
                name: true,
                Items: true
            }
        });

        if (!platform)
            throw new NotFoundException('Platform not found');

        if (platform.Items.length)
            throw new ConflictException('Platform has items, cannot delete');

        await this.prismaService.platform.delete({
            where: { platformId }
        });

        return `Platform ${platform.name} deleted !`;
    }

}
