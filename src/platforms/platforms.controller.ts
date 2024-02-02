import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Platform } from '@prisma/client';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { PlatformsService } from './platforms.service';

@Controller('platforms')
export class PlatformsController {

    constructor(private readonly platformsService: PlatformsService) { }

    @Get()
    async getAllPlatforms(): Promise<Platform[]> {
        return this.platformsService.getAllPlatforms();
    }

    @Post()
    async addPlatform(@Body() data: CreatePlatformDto): Promise<Platform> {
        return this.platformsService.addPlatform(data);
    }

    @Delete(':id')
    async deletePlatform(@Param('id') platformId: string): Promise<string> {
        return this.platformsService.deletePlatform(platformId);
    }

}
