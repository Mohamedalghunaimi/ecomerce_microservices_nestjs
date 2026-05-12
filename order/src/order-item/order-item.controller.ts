/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}



  @MessagePattern('order_items')
  findAll(
    {userId,orderId} : {userId:string,orderId:string}
  ) {
    return this.orderItemService.findAll(userId,orderId);
  }
}
