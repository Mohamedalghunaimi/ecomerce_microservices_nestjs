/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly cartClient: ClientProxy,
  ) {}
  create(createCartDto: CreateCartDto,userId:string) {
    return this.cartClient.send('create_cart', { ...createCartDto , userId});
  }

  remove(id: string,userId:string) {
    return this.cartClient.send('delete_cart', { id , userId});
  }
}
