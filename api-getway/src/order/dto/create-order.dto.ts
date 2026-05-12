/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty,  IsPhoneNumber, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateOrderDto {


  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  customerName!:string


  @IsString()
  @IsNotEmpty()
  @IsEmail()
  customerEmail!:string


   @IsString()
   @IsNotEmpty()
   city!:string


  @IsString()
  @IsNotEmpty()
   address!:string


   @IsNotEmpty()
   @IsString()
   @IsPhoneNumber("EG", {
    message: "Phone number must be a valid Egyptian number",
  })
   phone!:string

   @IsNotEmpty()
   @IsString()
   @IsUUID()
   cartId!:string
}
