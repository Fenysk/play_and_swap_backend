import { IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    displayName: string;

    @IsOptional()
    @IsString()
    avatarUrl: string;

    @IsOptional()
    @IsString()
    socialNetwork: string;
}