/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern } from '@nestjs/microservices';
import { orderData } from 'utils/interfaces';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  

  @MessagePattern("create_order")
  create(
    {userId,...createOrderDto} : { userId:string } & orderData
    
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


  @MessagePattern("update_order_status")
  updateStatus(
    {newStatus,orderId}: {newStatus:OrderStatus,orderId:string}
  ) {

    return this.orderService.changeOrderStatus(newStatus,orderId)

  }

  @MessagePattern("pay_order_by_stripe")
  pay(
    {orderId,userId} :{orderId:string,userId:string}
  ) {
    return this.orderService.pay(orderId,userId);

  }

  @MessagePattern("success_pay")
  successPay(
    {orderId,userId} :{orderId:string,userId:string}
  ) {
    return this.orderService.successPay(orderId,userId);

  }
  @MessagePattern("fail_pay")
  faildedPay(
    {orderId,userId} :{orderId:string,userId:string}
  ) {
    return this.orderService.failedPay(orderId,userId);

  }
}
