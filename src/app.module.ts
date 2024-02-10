import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { PrismaModule } from './prisma/prisma.module';
import { PlatformsModule } from './platforms/platforms.module';
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        ItemsModule,
        PlatformsModule,
        ReportsModule,
    ],
})
export class AppModule { }
