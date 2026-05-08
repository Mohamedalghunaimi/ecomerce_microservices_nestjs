/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CartItemService {

  constructor(
    @Inject('CART_SERVICE') private readonly cartClient:ClientProxy
  ) {

  }
 

  findAll(
    userId:string,
    cartId:string
  ) {
    return this.cartClient.send("cart_items",{userId,cartId})
  }



  update(id: string, updateCartItemDto: UpdateCartItemDto,userId:string) {
    return this.cartClient.send("update_cart_item",{ userId , id ,...updateCartItemDto})



  }

  remove(id:string,userId:string) {
    return this.cartClient.send("remove_cart_item",{ userId , id })

  }
}
