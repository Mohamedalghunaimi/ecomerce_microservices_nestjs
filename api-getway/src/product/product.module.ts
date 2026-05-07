/* eslint-disable prettier/prettier */
import { BadRequestException, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
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
    MulterModule.register({
      storage: diskStorage({
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          cb(new BadRequestException('invalid file'), false);
        }
        cb(null, true);
      },
    }),
    

  ]
})
export class ProductModule {}
