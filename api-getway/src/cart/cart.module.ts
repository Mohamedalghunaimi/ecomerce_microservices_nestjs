import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [CartController],
  providers: [CartService],
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
export class CartModule {}
