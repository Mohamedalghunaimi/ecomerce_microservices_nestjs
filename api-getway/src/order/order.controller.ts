/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body,  Param, Delete, UseGuards, Patch, ParseUUIDPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtGuard } from 'src/auth/gurads/jwt/jwt.guard';
import { User } from 'src/auth/decorators/user.decorator';
import type { UserPayload } from 'utils/types';
import { StatusDto } from './dto/order_status.dto';
import { AdminGuard } from 'src/auth/gurads/admin/admin.guard';

@Controller('order')
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @User() user:UserPayload
  ) {
    return this.orderService.create(user.id,createOrderDto);
  }

  @Get()
  findAll(
    @User() user:UserPayload
  ) {
    return this.orderService.findAll(user.id);
  }



  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user:UserPayload

  ) {
    return this.orderService.remove(id,user.id);
  }

  @Patch('order/:orderId')
  @UseGuards(AdminGuard)
  changeStatus(
    @Param("orderId", new ParseUUIDPipe()) orderId:string,
    @Body() {orderStatus} : StatusDto
  ) {
    return this.orderService.changeStatus(orderStatus,orderId)

  }


  @Post('pay/:orderId')
  pay(
    @User() user:UserPayload,
    @Param('orderId',new ParseUUIDPipe()) orderId:string
  ) {
    return this.orderService.pay(orderId,user.id)

  }
  @Post('success-pay/:orderId')
  successPay(
    @User() user:UserPayload,
    @Param('orderId',new ParseUUIDPipe()) orderId:string
  ) {
    return this.orderService.successPay(orderId,user.id)

  }

  @Post('failed-pay/:orderId')
  failedPay(
    @User() user:UserPayload,
    @Param('orderId',new ParseUUIDPipe()) orderId:string
  ) {
    return this.orderService.failedPay(orderId,user.id)

  }
}
