import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateReportDto {
    @IsNotEmpty()
    @IsString()
    gameId: string;

    @IsNotEmpty()
    @IsString()
    reason: string;

    @IsOptional()
    @IsString()
    message?: string;
}