/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body,  Param, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtGuard } from 'src/auth/gurads/jwt/jwt.guard';
import { User } from 'src/auth/decorators/user.decorator';
import type { UserPayload } from 'utils/types';

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
}
