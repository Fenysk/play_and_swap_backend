import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2";
import { PublicUser } from 'src/users/entities/public-user.model';
import { UsersService } from 'src/users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './types/tokens.types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) { }

    async register(registerDto: RegisterDto): Promise<string> {
        const hashedPassword = await argon2.hash(registerDto.password);

        const newUser: PublicUser = await this.userService.createNewUser({
            email: registerDto.email,
            hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            displayName: registerDto.displayName,
        });

        const confirmationId: string = await this.emailService.sendEmailConfirmation(newUser);

        await this.userService.updateUser(newUser.userId, { confirmationId })

        return 'Your account has been created successfully, please check your email to confirm your account';
    }

    async login(loginDto: LoginDto): Promise<Tokens> {
        const user = await this.userService.getUserByEmail(loginDto.email);

        if (!user)
            throw new ForbiddenException('Access denied');

        const isPasswordValid = await argon2.verify(user?.hashedPassword, loginDto.password);

        if (!isPasswordValid)
            throw new ForbiddenException('Access denied');

        delete user.hashedPassword;

        const tokens = await this.getTokens(user);
        await this.updateRefreshTokenHash(user.userId, tokens.refreshToken);

        return tokens;
    }

    async disconnect(userId: string): Promise<void> {
        await this.userService.updateUser(userId, {
            refreshToken: null
        });
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
        const user: any = await this.userService.getUserById(userId);

        if (!user?.refreshToken)
            throw new ForbiddenException('Access denied');

        const isRefreshTokenValid = await argon2.verify(user.refreshToken, refreshToken);

        if (!isRefreshTokenValid)
            throw new ForbiddenException('Access denied');

        const tokens = await this.getTokens(user);
        await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

        return tokens;
    }

    async confirmEmail(id: string): Promise<string> {
        const user = await this.userService.getUserByConfirmationId(id);

        if (!user)
            throw new ForbiddenException('Access denied');

        await this.userService.updateUser(user.userId, {
            confirmed: true,
            confirmationId: null,
            roles: { push: 'USER' }
        });

        await this.emailService.sendEmailWelcome(user);

        return 'Email confirmed successfully';
    }





    async getTokens(user: any): Promise<Tokens> {
        const payload = {
            sub: user.id,
            email: user.email
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15h',
            secret: this.configService.get('JWT_ACCESS_SECRET')
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });

        const tokens = { accessToken, refreshToken };

        return tokens;
    }

    async updateRefreshTokenHash(id: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await argon2.hash(refreshToken);

        await this.userService.updateUser(id, {
            refreshToken: hashedRefreshToken
        });
    }

}
