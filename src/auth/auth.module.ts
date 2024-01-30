import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessTokenStrategy } from './strategy/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
        EmailModule
    ],
    providers: [AuthService, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }
