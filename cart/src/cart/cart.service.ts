/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cart } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartData } from 'utils/interfaces';


@Injectable()
export class CartService {
  constructor(
    private readonly prisma :PrismaService
  ) {

  }
  async create(cartData: CartData,userId:string) :Promise<Cart> {
    const {productId,productName,price,quantity} = cartData ;

    const existingCart = await this.prisma.cart.findUnique({
      where:{userId}
    })
    if(!existingCart) {
      const newCart = await this.prisma.cart.create({
        data:{
          userId,
          totalPrice:price*quantity ,
          items:{
            create:{
              productId,
              price,
              productName,
              quantity
            }
          }
        }
      })
      return newCart ;
    }
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where:{
        cartId:existingCart.id,
        productId
      }
    })
    if(!existingCartItem) {
      await this.prisma.cartItem.create({
        data:{
          cartId:existingCart.id,
          productId,
          price,
          productName,
          quantity
        }
      })
      return existingCart
    }

    await this.prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: existingCart.id,
          productId
        }
      },
      data: {
        quantity: {
          increment:quantity
        }
      }
    })

    return existingCart;

    


  }
  remove(id: string,userId:string)  {
    return this.prisma.$transaction(async(prisma)=> {

    const existingCart = await prisma.cart.findFirst({
      where:{
        id,
        userId
      },
      select:{
        id:true
      }
    });
    if(!existingCart) {
      throw new RpcException({
        status:404,
        message:"cart not found"

      })
    }

    await prisma.cart.delete({
      where :{id:existingCart.id}
    })
    
    
    return {
      message:"cart is deleted successfully!"
    }


    }) 

 

  }
}
