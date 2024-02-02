import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAccessTokenGuard } from './auth/guards/jwt-access-token.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaClientExceptionFilter } from './prisma/filters/prisma/prisma-exception.filter';


async function bootstrap() {

    // NestJS
    const app = await NestFactory.create(AppModule);

    // Routes prefix
    app.setGlobalPrefix('api');

    // Prisma
    app.useGlobalFilters(new PrismaClientExceptionFilter())

    // JWT et Roles
    app.useGlobalGuards(
        new JwtAccessTokenGuard(new Reflector()),
        new RolesGuard(new Reflector())
    )

    // DTO Validation
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true
    }))

    // CORS
    app.enableCors({
        origin: '*',
        credentials: true
    });

    // Run
    await app.listen(3621);
}
bootstrap();
