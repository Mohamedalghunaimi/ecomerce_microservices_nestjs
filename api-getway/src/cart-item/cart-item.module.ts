import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
  imports: [
    ClientsModule.register([
      {
        name: 'CART_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'product-service',
          port: 3000,
        },
      },
    ]),
  ],
})
export class CartItemModule {}
