/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(30)
    title!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(10)
    description?: string;


    @IsString()
    @IsNotEmpty()
    slug!: string;
    
    @IsNumber()
    @MinLength(50)
    price!: number;



    @IsString()
    @IsNotEmpty()
    @IsUUID()
    categoryId!:string;


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    brand?: string;




}
