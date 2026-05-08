/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";


export class CreateCartDto {

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    productId!:string

    @IsString()
    @IsNotEmpty()
    productName!:string
    

    @IsNumber()
    @Min(25)
    price!:number 


    @IsNumber()
    @Min(0)
    quantity! : number


}