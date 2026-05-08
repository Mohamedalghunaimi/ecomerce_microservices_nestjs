/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Cart } from '@prisma/client';
import { PrismaClient } from '@prisma/client/extension';
import { CartItemService } from 'src/cart-item/cart-item.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartData } from 'utils/interfaces';


@Injectable()
export class CartService {
  constructor(
    private readonly prisma :PrismaService,
    @Inject(forwardRef(() => CartItemService))
    private readonly cartItemService:CartItemService
  ) {

  }
  async create(cartData: CartData,userId:string) :Promise<Cart> {
    const {productId,productName,price,quantity} = cartData ;

    const existingCart = await this.prisma.cart.findUnique({
      where:{userId},
      include:{
        items:true
      }
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
        },
        include:{
          items:true
        }
      })
      return newCart ;
    }
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where:{
        cartId_productId: {
          cartId: existingCart.id,
          productId
        }
      }
    })
    if(!existingCartItem) {
      const updatedCartItem = await this.prisma.cartItem.create({
        data:{
          cartId:existingCart.id,
          productId,
          price,
          productName,
          quantity
        }
      })
      const amount = quantity * price
      await this.updateCart({
        id:updatedCartItem.cartId,
        amount
      
      })
      return existingCart
    }


    await this.cartItemService.update(
      existingCartItem.id,
      {quantity},
      userId
    )

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




  async updateCart(
    {id,amount }:{id:string,amount:number},
    prisma:PrismaClient = this.prisma
  ) {
    
    await prisma.cart.update({
      where:{id},
      data:{
        totalPrice:{
          increment:amount
        }
      }
    })
  }
}
