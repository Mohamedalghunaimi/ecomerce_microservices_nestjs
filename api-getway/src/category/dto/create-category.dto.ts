/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(50)
    name!: string;

    
    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(25)
    @IsOptional()
    description?: string;
    

    
}
