import { Region, State } from "@prisma/client";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    @IsString()
    platformId: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    edition?: string;

    @IsNotEmpty()
    @IsString()
    region: Region;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsBoolean()
    hasGame?: boolean;

    @IsOptional()
    @IsString()
    stateGame?: State;

    @IsOptional()
    @IsBoolean()
    hasBox?: boolean;

    @IsOptional()
    @IsString()
    stateBox?: State;

    @IsOptional()
    @IsBoolean()
    hasManual?: boolean;

    @IsOptional()
    @IsString()
    stateManual?: State;

    @IsOptional()
    @IsBoolean()
    hasCover?: boolean;

    @IsOptional()
    @IsString()
    stateCover?: State;

    @IsOptional()
    @IsString({ each: true })
    extraContent?: string[];

    isVisible?: boolean;
}
