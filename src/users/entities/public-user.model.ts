import { Role } from "@prisma/client";

export interface PublicUser {
    userId: string;

    email: string;
    hashedRefreshToken?: string;

    confirmationId?: string;
    confirmed: boolean;

    roles: Role[];

    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;

    Profile?: object;
    UserDetails?: object;
}
