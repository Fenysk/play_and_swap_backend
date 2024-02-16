import { Manufacturer } from "@prisma/client";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePlatformDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsDateString()
    releaseDate: Date;

    @IsNotEmpty()
    manufacturer: Manufacturer;

    @IsNotEmpty()
    @IsNumber()
    generation: number;

    @IsOptional()
    logoUrl: string
}
