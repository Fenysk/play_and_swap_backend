import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon2 from "argon2";
import { PrismaService } from '../prisma/prisma.service';
import { InputUserDto } from './dto';

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
        const user = await this.prismaService.user.findUniqueOrThrow({ where: { userId: id } });

        delete user.hashedPassword;

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.prismaService.user.findUniqueOrThrow({ where: { email } });
        return user;
    }

    async getUserByConfirmationId(confirmationId: string): Promise<User> {
        const user = await this.prismaService.user.findFirstOrThrow({
            where: { confirmationId },
            include: { Profile: true }
        });
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
            throw new ForbiddenException('Error updating password');

        const hashedPassword = await argon2.hash(newPassword);

        const updatedUser = await this.prismaService.user.update({
            where: { userId },
            data: { hashedPassword }
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
