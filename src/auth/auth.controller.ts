import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { Public } from './decorator/is-public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtRefreshTokenGuard } from "./guards/jwt-refresh-token.guard";
import { Tokens } from "./types/tokens.types";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() registerDto: RegisterDto): Promise<any> {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto): Promise<Tokens> {
        return this.authService.login(loginDto);
    }

    @Post('disconnect')
    @HttpCode(HttpStatus.OK)
    disconnect(@GetUser('sub') userId: string) {
        return this.authService.disconnect(userId);
    }

    @Public()
    @UseGuards(JwtRefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetUser('sub') userId: string,
        @GetUser('refreshToken') refreshToken: string
    ) {
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Public()
    @Get('confirm-account/:id')
    confirmEmail(@Param('id') id: string) {
        return this.authService.confirmEmail(id);
    }

}
