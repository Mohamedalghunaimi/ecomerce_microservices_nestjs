/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CartItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartData } from 'utils/interfaces';

@Injectable()
export class CartItemService {
  constructor(private readonly prisma:PrismaService) {}

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
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where:{id,cart:{userId}}
    });
    if(!existingCartItem) {
      throw new RpcException({
        status:404,
        message:"cart-item not found"
      })
    }
    await this.prisma.cartItem.update({
      where:{id:existingCartItem.id},
      data:{
        quantity : {
          increment: quantity ?? 0
        }
      }
    })
    
      
  }

  remove(id: string,userId:string) {
    return this.prisma.$transaction(async(prisma)=> {
    const existingCartItem = await prisma.cartItem.findFirst({
      where:{id,cart:{userId}},
      select:{id:true}
    });
    if(!existingCartItem) {
      throw new RpcException({
        status:404,
        message:"cart-item not found"
      })
    }  
    await prisma.cartItem.delete({
      where:{id:existingCartItem.id}
      
    })
    return {
      message :"cart-item is deleted"
    }
    })

  }
}
