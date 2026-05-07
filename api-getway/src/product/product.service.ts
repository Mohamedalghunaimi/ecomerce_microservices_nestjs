/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductService {

constructor(
  @Inject('PRODUCT_SERVICE' ) private readonly productClient: ClientProxy
) {}
  create(createProductDto: CreateProductDto) {
    return this.productClient.send('create_product', createProductDto);
  }

  findAll() {
    return this.productClient.send('find_all_products', {});
  }

  findOne(id: string) {
    return this.productClient.send('find_one_product', { id });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productClient.send('update_product', { id, ...updateProductDto });
  }

  remove(id: string) {
    return this.productClient.send('delete_product', { id });
  }

  findByCategory(categoryId: string) {
    return this.productClient.send('find_products_by_category', { categoryId });
  }

  reActive(id:string) {
    return this.productClient.send('reActive_Product_by_id', { id });


  }

  uploadImage(file:string,productId:string) {
    return this.productClient.send("upload_img",{ file ,productId})
  }

}
