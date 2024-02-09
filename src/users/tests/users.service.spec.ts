import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublicUser } from '../entities/public-user.model';
import { UsersService } from '../users.service';

describe('UsersService', () => {
    let usersService: UsersService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                PrismaService
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    const userExample: any = {
        userId: 'uuid-uuid-uuid-uuid',

        email: 'maite@tf1.fr',
        hashedPassword: 'hashedPassword',
        hashedRefreshToken: 'hashedRefreshToken',

        confirmationId: 'uuid2-uuid2-uuid2-uuid2',
        confirmed: true,

        roles: ['USER'],

        Profile: {
            userId: 'uuid-uuid-uuid-uuid',
            displayName: 'Xx_Maïté_la_cuisinière_xX',
            avatarUrl: 'https://static1.purepeople.com/articles/0/40/02/80/@/5755253-maite-lors-d-une-conference-de-presse-po-1200x0-3.jpg',
        },

        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
    }

    const publicUserExample: PublicUser = {
        userId: 'uuid-uuid-uuid-uuid',

        email: 'maite@tf1.fr',
        hashedRefreshToken: 'hashedRefreshToken',

        confirmationId: 'uuid2-uuid2-uuid2-uuid2',
        confirmed: true,

        roles: ['USER'],

        Profile: {
            userId: 'uuid-uuid-uuid-uuid',
            displayName: 'Xx_Maïté_la_cuisinière_xX',
            avatarUrl: 'https://static1.purepeople.com/articles/0/40/02/80/@/5755253-maite-lors-d-une-conference-de-presse-po-1200x0-3.jpg',
        },

        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
    }

    describe('getAllUsers', () => {

        it('should return an array of users', async () => {
            const expectedResult: PublicUser[] = [publicUserExample, publicUserExample];

            const prismaResponse: User[] = [userExample, userExample];
            prismaService.user.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await usersService.getAllUsers();

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.findMany).toHaveBeenCalled();
        });


        it('should throw 404 error if no users found', () => {
            const expectedError: NotFoundException = new NotFoundException('No users found');

            const prismaResponse: User[] = [];
            prismaService.user.findMany = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = usersService.getAllUsers();

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.user.findMany).toHaveBeenCalled();
        });

    });

    describe('getUserById', () => {

        it('should return a user', async () => {
            const expectedResult: PublicUser = publicUserExample;

            const prismaResponse: User = userExample;
            prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await usersService.getUserById('uuid-uuid-uuid-uuid');

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.findUnique).toHaveBeenCalled();
        });


        it('should throw 404 error if no user found', () => {
            const expectedError: NotFoundException = new NotFoundException('No user found');

            const prismaResponse: User = null;
            prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = usersService.getUserById('uuid-uuid-uuid-uuid');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.user.findUnique).toHaveBeenCalled();
        });

    });

    describe('getUserByEmail', () => {

        it('should return a user', async () => {
            const expectedResult: User = userExample;

            const prismaResponse: User = userExample;
            prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = await usersService.getUserByEmail('maite@tf1.fr');

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.findUnique).toHaveBeenCalled();
        });

        it('should throw 404 error if no user found', () => {
            const expectedError: NotFoundException = new NotFoundException('No user found');

            const prismaResponse: User = null;
            prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = usersService.getUserByEmail('maite@tf1.fr');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.user.findUnique).toHaveBeenCalled();
        });

    });

    describe('getUserByConfirmationId', () => {

        it('should return a user', async () => {
            const expectedResult: User = userExample;

            const prismaResponse: User = userExample;
            prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = await usersService.getUserByConfirmationId('uuid2-uuid2-uuid2-uuid2');

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.findFirst).toHaveBeenCalled();
        });

        it('should throw 404 error if no user found', () => {
            const expectedError: NotFoundException = new NotFoundException('No user found');

            const prismaResponse: User = null;
            prismaService.user.findFirst = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = usersService.getUserByConfirmationId('uuid2-uuid2-uuid2-uuid2');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.user.findFirst).toHaveBeenCalled();
        });

    });

    describe('createNewUser', () => {

        const newUser = {
            email: 'maite@tf1.fr',
            hashedPassword: 'hashedPasswordAnguille',
            firstName: 'Maïté',
            lastName: 'Ordonez',
            displayName: 'Maïté la cuisinière',
        }


        it('should return a user', async () => {
            const expectedResult: User = userExample;

            const prismaResponse: User = userExample;
            prismaService.user.create = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await usersService.createNewUser(newUser);

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.create).toHaveBeenCalled();
        });

        it('should throw error if user already exists', () => {
            const expectedError: ConflictException = new ConflictException('User already exists');
            prismaService.user.create = jest.fn().mockRejectedValueOnce(expectedError);


            const result = usersService.createNewUser(newUser);

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.user.create).toHaveBeenCalled();
        });

    });

    describe('becomeSeller', () => {

        const sellerExample: User = {
            ...userExample,
            roles: ['USER', 'SELLER'],
        }

        it('should return a user', async () => {
            const expectedResult: string = 'You are now a seller';

            const prismaResponse: User = sellerExample;
            prismaService.user.update = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await usersService.becomeSeller('uuid-uuid-uuid-uuid');

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.update).toHaveBeenCalled();
        });

        it('should throw error if user does not exist', () => {
            const expectedNotFoundError: NotFoundException = new NotFoundException('No user found');
            prismaService.user.update = jest.fn().mockRejectedValueOnce(expectedNotFoundError);

            const result = usersService.becomeSeller('bad_uuid-bad_uuid-bad_uuid-bad_uuid');

            expect(result).rejects.toThrow(expectedNotFoundError);
            expect(prismaService.user.update).toHaveBeenCalled();
        });

    });

    describe('updateUser', () => {

        it('should return a user', async () => {
            const expectedResult: User = userExample;

            const prismaResponse: User = userExample;
            prismaService.user.update = jest.fn().mockResolvedValueOnce(prismaResponse);


            const result = await usersService.updateUser('uuid-uuid-uuid-uuid', {
                email: 'maite@tf1.fr',
                hashedPassword: 'hashedPasswordAnguille',
            });

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.update).toHaveBeenCalled();
        });

        it('should throw error if user does not exist', () => {
            const expectedNotFoundError: NotFoundException = new NotFoundException('No user found');
            prismaService.user.update = jest.fn().mockRejectedValueOnce(expectedNotFoundError);


            const result = usersService.updateUser('uuid-uuid-uuid-uuid', {
                email: 'maite@tf1.fr',
                hashedPassword: 'hashedPasswordAnguille',
            });

            expect(result).rejects.toThrow(expectedNotFoundError);
            expect(prismaService.user.update).toHaveBeenCalled();
        });

        it('should throw error if conflicting email', () => {
            const expectedConflictError: ConflictException = new ConflictException('Email already exists');
            prismaService.user.update = jest.fn().mockRejectedValueOnce(expectedConflictError);


            const result = usersService.updateUser('uuid-uuid-uuid-uuid', {
                email: 'maite@tf1.fr',
            });

            expect(result).rejects.toThrow(expectedConflictError);
            expect(prismaService.user.update).toHaveBeenCalled();
        });

    });

    describe('deleteUser', () => {

        it('should return a user', async () => {
            const expectedResult: string = 'maite@tf1.fr deleted';

            const prismaResponse: User = userExample;
            prismaService.user.delete = jest.fn().mockResolvedValueOnce(prismaResponse);

            const result = await usersService.deleteUser('uuid-uuid-uuid-uuid');

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.delete).toHaveBeenCalled();
        });

        it('should throw error if user does not exist', () => {
            const expectedError: NotFoundException = new NotFoundException('No user found');
            prismaService.user.delete = jest.fn().mockRejectedValueOnce(expectedError);


            const result = usersService.deleteUser('uuid-uuid-uuid-uuid');

            expect(result).rejects.toThrow(expectedError);
            expect(prismaService.user.delete).toHaveBeenCalled();
        });

    });


    describe('updateMyProfile', () => {

        const updatedUser = {
            userId: 'uuid-uuid-uuid-uuid',

            email: 'maite@tf1.fr',
            hashedPassword: 'hashedPassword',
            hashedRefreshToken: 'hashedRefreshToken',

            confirmationId: 'uuid2-uuid2-uuid2-uuid2',
            confirmed: true,

            roles: ['USER'],

            Profile: {
                userId: 'uuid-uuid-uuid-uuid',
                displayName: 'Xx_Maïté_xX',
                avatarUrl: 'https://static1.purepeople.com/articles/0/40/02/80/@/5755253-maite-lors-d-une-conference-de-presse-po-1200x0-3.jpg',
            },

            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date(),
        };

        it('should return the user', async () => {
            const expectedResult = updatedUser;

            const prismaFindUniqueResponse: User = userExample;
            prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);

            const prismaUpdateResponse = updatedUser;
            prismaService.user.update = jest.fn().mockResolvedValueOnce(prismaUpdateResponse);

            const result = await usersService.updateProfile('uuid-uuid-uuid-uuid', { displayName: 'Xx_Maïté_xX' });

            expect(result).toEqual(expectedResult);
            expect(prismaService.user.findUnique).toHaveBeenCalled();
            expect(prismaService.user.update).toHaveBeenCalled();
        });

        it('should throw error if user does not exist', () => {
            const expectedNotFoundError: NotFoundException = new NotFoundException('No user found');

            const prismaFindUniqueResponse: User = null;
            prismaService.user.findUnique = jest.fn().mockResolvedValueOnce(prismaFindUniqueResponse);

            const result = usersService.updateProfile('uuid_bad-uuid_bad-uuid_bad-uuid_bad', { displayName: 'Xx_Maïté_xX' });

            expect(result).rejects.toThrow(expectedNotFoundError);
            expect(prismaService.user.findUnique).toHaveBeenCalled();
        });

    });

});
