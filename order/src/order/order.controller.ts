/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern } from '@nestjs/microservices';
import { orderData } from 'utils/interfaces';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  

  @MessagePattern("create_order")
  create(
    {userId,...createOrderDto} : {userId:string} & orderData
    
  ) {
    return this.orderService.create(createOrderDto,userId);
  }
  @MessagePattern("get_orders")
  findAll(
    {userId}:{userId:string}
  ) {
    return this.orderService.findAll(userId);
  }




  @MessagePattern('cancel_order')
  remove(
    {orderId,userId}:{orderId:string,userId:string}
  ) {
    return this.orderService.remove(orderId,userId);
  }
}
