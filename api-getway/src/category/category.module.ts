/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'product-service',
          port: 3000,
        },
      },
    ]),
    
  ],
})
export class CategoryModule {}
