import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as argon2 from "argon2";
import { PrismaService } from '../prisma/prisma.service';
import { InputUserDto } from './dto';
import { UpdateInformationDto } from './dto/update-information.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async getAllUsers(): Promise<User[]> {
        const users = await this.prismaService.user.findMany();

        if (!users.length)
            throw new NotFoundException('No users found');

        users.forEach(user => delete user.hashedPassword);

        return users;
    }

    async getUserById(id: string): Promise<any> {
        const user = await this.prismaService.user.findUnique({ where: { userId: id } });

        if (!user)
            throw new NotFoundException('No user found');

        delete user.hashedPassword;

        return user;
    }

    async getDetailedMe(userId: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: { userId },
            include: {
                Profile: true,
                UserDetails: true
            }
        });

        if (!user)
            throw new NotFoundException('No user found');

        delete user.hashedPassword;
        delete user.hashedRefreshToken;
        delete user.confirmationId;

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({ where: { email } });

        if (!user)
            throw new NotFoundException('No user found');

        return user;
    }

    async getUserByConfirmationId(confirmationId: string): Promise<User> {
        const user = await this.prismaService.user.findFirst({
            where: { confirmationId },
            include: { Profile: true }
        });

        if (!user)
            throw new NotFoundException('No user found');

        return user;
    }

    async createNewUser(data: InputUserDto): Promise<User> {
        try {
            const newUser = await this.prismaService.user.create({
                data: {
                    email: data.email,
                    hashedPassword: data.hashedPassword,

                    Profile: {
                        create: {
                            displayName: data.displayName,
                        }
                    },

                    UserDetails: {
                        create: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                        }
                    }
                }
            });

            return newUser;
        } catch (error) {
            throw error
        }
    }

    async becomeSeller(userId: string): Promise<string> {
        const user = this.prismaService.user.findUnique({
            where: { userId }
        });

        if (!user)
            throw new NotFoundException('No user found');

        await this.prismaService.user.update({
            where: { userId },
            data: {
                roles: {
                    push: Role.SELLER
                }
            }
        });

        return 'You are now a seller';
    }

    async becomeAdmin(userId: string): Promise<string> {
        const users = await this.prismaService.user.findMany();

        if (users.length !== 1)
            throw new ForbiddenException('You are not authorized to perform this action');

        const user = this.prismaService.user.findUnique({
            where: { userId }
        });

        if (!user)
            throw new NotFoundException('No user found');

        await this.prismaService.user.update({
            where: { userId },
            data: {
                roles: {
                    push: Role.ADMIN
                }
            }
        });

        return 'You are now an admin';
    }

    async updateUser(userId: string, data: any): Promise<User> {
        try {
            const updatedUser = await this.prismaService.user.update({
                where: { userId },
                data
            });

            return updatedUser;
        } catch (error) {
            throw error
        }
    }

    async updateMyPassword(userId: string, data: any): Promise<User> {
        const { oldPassword, newPassword } = data;

        const user = await this.prismaService.user.findUnique({
            where: { userId }
        });

        const isPasswordValid = await argon2.verify(user.hashedPassword, oldPassword);

        if (!isPasswordValid)
            throw new ForbiddenException('Your old password is incorrect');

        const hashedPassword = await argon2.hash(newPassword);

        const updatedUser = await this.prismaService.user.update({
            where: { userId },
            data: { hashedPassword }
        });

        return updatedUser;
    }

    async updateProfile(userId: string, data: UpdateProfileDto): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { userId },
            include: { Profile: true }
        });

        if (!user)
            throw new NotFoundException('No user found');

        const updatedUser = await this.prismaService.user.update({
            where: { userId },
            data: {
                Profile: {
                    update: data
                }
            },
            select: {
                Profile: true
            }
        });

        return updatedUser;
    }

    async updateInformation(userId: string, data: UpdateInformationDto): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: { userId },
            include: { UserDetails: true }
        });

        if (!user)
            throw new NotFoundException('No user found');

        const updatedUser = await this.prismaService.user.update({
            where: { userId },
            data: {
                UserDetails: {
                    update: data
                }
            },
            select: {
                UserDetails: true
            }
        });

        return updatedUser;
    }

    async deleteUser(userId: string): Promise<string> {
        try {
            const deletedUser = await this.prismaService.user.delete({
                where: { userId }
            });

            if (!deletedUser)
                throw new NotFoundException('No user found');

            return `${deletedUser.email} deleted`;
        } catch (error) {
            throw error
        }

    }
}
