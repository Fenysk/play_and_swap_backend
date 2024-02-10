import { IsOptional, IsString } from "class-validator";

export class UpdateInformationDto {
    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;
}