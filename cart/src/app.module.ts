import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';

@Module({
  imports: [CartModule, CartItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
