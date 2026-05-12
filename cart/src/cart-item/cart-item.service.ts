/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CartItem } from '@prisma/client';
import { CartService } from 'src/cart/cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartData } from 'utils/interfaces';

@Injectable()
export class CartItemService {
  constructor(
    private readonly prisma:PrismaService,
    @Inject(forwardRef(() => CartService))
    private readonly cartService:CartService
  ) {}

  async findAll(
    cartId:string,
    userId:string
  ) : Promise<CartItem[]> {

    const existingCart = await this.prisma.cart.findUnique({
      where:{id:cartId,userId}
    })
    if(!existingCart) {
      throw new RpcException({
        status:404,
        message:"Cart is not existing"
      })
    }
    const cartItems = await this.prisma.cartItem.findMany({
      where:{cartId:existingCart.id}
    })

    return cartItems

  }


  async update(id: string, updateCartItemDto: Partial<CartData>,userId:string) {
    const { quantity } = updateCartItemDto ;

    return this.prisma.$transaction(async(prisma)=> {
      
    const existingCartItem = await prisma.cartItem.findFirst({
      where:{id,cart:{userId}}
    });
    if(!existingCartItem) {
      throw new RpcException({
        status:404,
        message:"cart-item not found"
      })
    }
    if(!quantity) {
      throw new RpcException({
        status:400,
        message:"quantity is required"
      })

    } 
    const amount = (existingCartItem.quantity - quantity) * existingCartItem.price ;

    await this.cartService.updateCart({
      id:existingCartItem.cartId,
      amount,
    },prisma)

    const updatedCartItem = await prisma.cartItem.update({
      where:{id:existingCartItem.id},
      data:{
        quantity 
      }
    })
    return updatedCartItem
    })




    
    
      
  }

  remove(
    id: string,
    userId:string
  ) {
    return this.prisma.$transaction(async(prisma)=> {
    const existingCartItem = await prisma.cartItem.findFirst({
      where:{id,cart:{userId}},
    });
    if(!existingCartItem) {
      throw new RpcException({
        status:404,
        message:"cart-item not found"
      })
    }  
    const amount = (existingCartItem.quantity * existingCartItem.price * -1 );


    await this.cartService.updateCart({
      id:existingCartItem.cartId,
      amount
    },prisma)



    await prisma.cartItem.delete({
      where:{id:existingCartItem.id}
      
    })



    return {
      message :"cart-item is deleted"
    }
    })

  }
}
