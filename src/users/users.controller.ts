import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { GetUser, Roles } from './decorator';
import { UpdateInformationDto } from './dto/update-information.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from './entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles(Role.ADMIN)
    @Get()
    async getAllUsers(): Promise<object[]> {
        return await this.usersService.getAllUsers();
    }

    @Roles(Role.USER)
    @Get('me')
    async getMe(@GetUser() user: any): Promise<object> {
        return user;
    }

    @Roles(Role.USER)
    @Get('detailed-me')
    async getDetailedMe(@GetUser('sub') user_id: any): Promise<object> {
        return await this.usersService.getDetailedMe(user_id);
    }

    @Roles(Role.ADMIN)
    @Get(':user_id')
    async getUserById(@Param('user_id') user_id: string): Promise<object> {
        return await this.usersService.getUserById(user_id);
    }

    @Roles(Role.ADMIN)
    @Post('create')
    async createUser(@Body() data: any): Promise<object> {
        return await this.usersService.createNewUser(data);
    }

    @Roles(Role.USER)
    @Post('become-seller')
    async becomeSeller(@GetUser('sub') user_id: any): Promise<string> {
        return await this.usersService.becomeSeller(user_id);
    }

    @Roles(Role.USER)
    @Post('become-admin')
    async becomeAdmin(@GetUser('sub') user_id: any): Promise<string> {
        return await this.usersService.becomeAdmin(user_id);
    }

    @Roles(Role.USER)
    @Put('update/me')
    @HttpCode(HttpStatus.OK)
    async updateMe(@GetUser('sub') user_id: any, @Body() data: any): Promise<object> {
        return await this.usersService.updateUser(user_id, data);
    }

    @Roles(Role.USER)
    @Put('update/my-profile')
    @HttpCode(HttpStatus.OK)
    async updateMyProfile(
        @GetUser('sub') user_id: any,
        @Body() data: UpdateProfileDto
    ): Promise<object> {
        return await this.usersService.updateProfile(user_id, data);
    }

    @Roles(Role.USER)
    @Put('update/my-information')
    @HttpCode(HttpStatus.OK)
    async updateMyInformation(
        @GetUser('sub') user_id: any,
        @Body() data: UpdateInformationDto
    ): Promise<object> {
        return await this.usersService.updateInformation(user_id, data);
    }

    @Roles(Role.USER)
    @Put('update/my-password')
    @HttpCode(HttpStatus.OK)
    async updateMyPassword(@GetUser('sub') user_id: string, @Body() data: any): Promise<object> {
        return await this.usersService.updateMyPassword(user_id, data);
    }

    @Roles(Role.ADMIN)
    @Put('update/:user_id/profile')
    @HttpCode(HttpStatus.OK)
    async updateProfileByAdmin(@Param('user_id') user_id: string, @Body() data: any): Promise<object> {
        return await this.usersService.updateProfile(user_id, data);
    }

    @Roles(Role.ADMIN)
    @Delete(':user_id')
    async deleteUser(@Param('user_id') user_id: string): Promise<string> {
        return await this.usersService.deleteUser(user_id);
    }

    @Roles(Role.USER)
    @Delete('delete/me')
    async deleteMyAccount(@GetUser('sub') user_id: string): Promise<string> {
        return await this.usersService.deleteUser(user_id);
    }

}
