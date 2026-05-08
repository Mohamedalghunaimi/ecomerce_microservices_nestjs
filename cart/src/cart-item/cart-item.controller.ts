/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { MessagePattern } from '@nestjs/microservices';
import { CartData } from 'utils/interfaces';


@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}


   
  @MessagePattern('cart_items')
  findAll(
    {userId,cartId}:{userId:string,cartId:string}
  ) {
    return this.cartItemService.findAll(cartId,userId);
  }

  @MessagePattern("update_cart_item")
  update(
  { userId , id ,...updateCartItemDto} : {userId:string , id:string}  & Partial<CartData>
  ) {
    return this.cartItemService.update(id, updateCartItemDto,userId);
  }

  @MessagePattern("remove_cart_item")
  remove(
    { userId , id } :{ userId:string,id:string}
  ) {
    return this.cartItemService.remove(id,userId);
  }
}
