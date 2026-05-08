/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { MessagePattern } from '@nestjs/microservices';
import type { CartData } from 'utils/interfaces';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  

  @MessagePattern('create_cart')
  create(
    {userId,...cartData}: { userId:string } & CartData 
  ) {
    return this.cartService.create(cartData,userId);
  }




  @MessagePattern('delete_cart')
  remove(
    {id,userId} : {id:string,userId:string}
  ) {
    return this.cartService.remove(id,userId) ;
  }
}
