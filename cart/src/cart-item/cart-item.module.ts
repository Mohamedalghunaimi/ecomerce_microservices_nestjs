/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
  imports :[forwardRef(()=>CartModule)],
  exports :[CartItemService]
})
export class CartItemModule {}
