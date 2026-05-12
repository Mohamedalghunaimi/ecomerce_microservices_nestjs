/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { OrderStatus } from './dto/order_status.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject("ORDER_SERVICE") private readonly orderClient : ClientProxy
  ) {}
  create(
    userId:string,
    createOrderDto : CreateOrderDto
  ) {
    return  this.orderClient.send("create_order" ,{ userId ,...createOrderDto})

  }

  findAll(
    userId:string
  ) {

    return this.orderClient.send("get_orders" ,{userId})
  }


  remove(
    orderId:string,
    userId:string

  ) {
    return this.orderClient.send("cancel_order", {orderId,userId})
  }


  changeStatus(
    newStatus:OrderStatus,
    orderId:string
  ) {
    return this.orderClient.send("update_order_status",{newStatus,orderId})
  }
}
