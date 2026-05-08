/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CartModule, 
    CartItemModule, 
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:".env"
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
