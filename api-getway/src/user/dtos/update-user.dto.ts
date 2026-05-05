/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName?: string;

    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName?: string;


    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phone?:string

}