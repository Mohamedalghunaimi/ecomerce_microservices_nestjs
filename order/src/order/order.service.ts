/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CartItem, orderData } from 'utils/interfaces';
import { shippingFee, tax } from 'utils/constants';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma : PrismaService,
    @Inject('CART_SERVICE') private readonly cartClient : ClientProxy,
    private readonly stripe:StripeService
  ) {}
  async create(
    createOrderDto: orderData,
    userId:string
  ) {
    const {
      cartId,
      customerEmail,
      customerName,
      city,
      address,
      phone,
    } = createOrderDto ;

    const cartItems = await firstValueFrom(
      this.cartClient.send('cart_items',{cartId,userId}) 
    ) as CartItem[]; 


    if(cartItems.length === 0 ) {
      throw new RpcException({
        status:400,
        message:"cart is empty"

      })
    }

    const orderItems = cartItems.map((item)=> ({
      productId:item.productId,
      productName:item.productName,
      image:item.image,
      price:item.price,
      quantity:item.quantity
    }) )


    

    const subtotal = cartItems.reduce((acc,current)=> acc + current.price * current.quantity ,0)
    const totalPrice = subtotal + shippingFee + tax ;

 

    const newOrder = await this.prisma.order.create({
      data:{
        userId,
        city,
        customerEmail,
        customerName,
        address,
        phone,
        subtotal,
        shippingFee,
        tax,
        totalPrice,
        items :{
          create:[
            ...orderItems
          ]
        }
      },
      include:{
        items:true
      }
    })

    await firstValueFrom(
      this.cartClient.send('delete_cart',{id:cartId,userId})
    )

    return newOrder

  }

  async findAll(userId:string) {
    const orders = await this.prisma.order.findMany({
      where:{userId}
    })
    return orders

  }




  async remove(orderId:string,userId:string) {
    const existingOrder = await this.prisma.order.findFirst({
      where:{
        id:orderId,
        userId,
        orderStatus:"PENDING"
      }
    })
    if(!existingOrder) {
      throw new RpcException({
        status:404,
        message:"Orderis not found"
      })
    }
    await this.prisma.order.update({
      where:{id:existingOrder.id},
      data:{
        orderStatus:"CANCELLED"
      }
    })

    return {
      message:"Order is cancelled successfully"
    }

  }


  async changeOrderStatus(
    newStatus: OrderStatus,
    orderId:string
  ) {
    const existingOrder = await this.prisma.order.findUnique({
      where:{id:orderId}
    })
    if(!existingOrder) {
      throw new RpcException({
        status:404,
        message:"Order not found"
      })
    }
    const updatedOrder = await this.prisma.order.update({
      where:{id:orderId},
      data:{
        orderStatus:newStatus
      }
    })

    return updatedOrder
  }

  async pay(orderId:string,userId:string) {
    const existingOrder = await this.prisma.order.findFirst({
      where:{
        id:orderId,
        userId,
        orderStatus:{
          notIn:["CANCELLED","DELIVERED"]
        },
        paymentStatus:"PENDING"
      }
    });
    if(!existingOrder) {
      throw new RpcException({
        status:404,
        messae:"Order not found"
      })
    }

    const session   = await this.stripe.createCheckoutSession(existingOrder) ;
    await this.prisma.order.update({
      where:{id:orderId},
      data:{
        stripeSession:session.id
      }
    })


    return session.url
  }

  async successPay(orderId:string,userId:string) {
    const existingOrder = await this.prisma.order.findFirst({
      where:{
        id:orderId,
        userId,
        orderStatus:{
          notIn:["CANCELLED","DELIVERED"]
        },
        paymentStatus:"PENDING"
      }
    });
    if(!existingOrder) {
      throw new RpcException({
        status:404,
        messae:"Order not found"
      })
    }
    if(!existingOrder.stripeSession) {
      throw new RpcException({
        status: 400,
        message: "Invalid stripe session"
      })
    }
    const session = await this.stripe.retriveSession(existingOrder.stripeSession as string);
    if(session.payment_status!=="paid") {
      await this.updateOrder({
        orderId:existingOrder.id,
        stripeSession:null,
        newStatus:"FAILED"
      })
      throw new RpcException({
        status:403,
        message:"forbidden"
      })
    }



    const updatedOrder = await this.updateOrder({
      orderId:existingOrder.id,
      stripeSession:null,
      newStatus:"PAID"
    })
    
    return updatedOrder

  

  }

  async failedPay(orderId:string,userId:string) {
    const existingOrder = await this.prisma.order.findFirst({
      where:{
        id:orderId,
        userId,
        orderStatus:{
          notIn:["CANCELLED","DELIVERED"]
        },
        paymentStatus:"PENDING"
      }
    });
    if(!existingOrder) {

      throw new RpcException({
        status:404,
        message:"Order not found"
      })
    }
    if(!existingOrder.stripeSession) {
      throw new RpcException({
        status: 400,
        message: "Invalid stripe session"
      })
    }
    const session = await this.stripe.retriveSession(existingOrder.stripeSession);
    if(session.payment_status!=="unpaid") {
      throw new RpcException({
        status:400,
        message:"Order is paid"
      })
    }


    const updatedOrder = await this.updateOrder(
      {
        orderId:existingOrder.id,
        stripeSession:null,
        newStatus:"FAILED"
      }
    )
    return updatedOrder

  

  }


  private async updateOrder(
    {orderId,stripeSession,newStatus} : {orderId:string,stripeSession:string | null , newStatus :PaymentStatus}
  ) {

    const updatedOrder = await this.prisma.order.update({
      where:{id:orderId},
      data:{
        paymentStatus:newStatus,
        stripeSession
      }
    });

    return updatedOrder
    
  }


  
}
