/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItemModule } from 'src/cart-item/cart-item.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports:[forwardRef(()=>  CartItemModule)],
  exports :[CartService]
})
export class CartModule {}
