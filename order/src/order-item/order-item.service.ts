/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderItemService {

  constructor(private readonly prisma:PrismaService) {}
  async findAll(
    userId:string,
    orderId:string
  ) {
    const existingOrder = await this.prisma.order.findFirst({
      where:{
        id:orderId,
        userId
      }
    });
    if(!existingOrder) {
      throw new RpcException({
        status:404,
        message:"Order not found"
      })
    }

    const orderItems = await this.prisma.orderItem.findMany({
      where:{
        orderId,
        
      }
    })


    return orderItems



  }


}
