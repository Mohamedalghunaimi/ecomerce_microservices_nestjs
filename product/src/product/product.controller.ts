/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import type { ProductData } from 'utils/interfaces';
import { MessagePattern } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('create_product')
  create(createProductDto: ProductData) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern('find_all_products')
  findAll() {
    return this.productService.findAll();
  }
  @MessagePattern('find_one_product')
  findOne(data: { id: string }) {
    return this.productService.findOne(data.id);
  }
  @MessagePattern('update_product')
  update(
    data: { id: string } & Partial<ProductData>
  ) {
    const { id, ...updateProductDto } = data;
    return this.productService.update(id, updateProductDto);
  }

  @MessagePattern('delete_product')
  delete(data: { id: string }) {
    return this.productService.delete(data.id);
  }
  @MessagePattern('find_products_by_category')
  findByCategory(data: { categoryId: string }) {
    return this.productService.findByCategory(data.categoryId);
  }

  @MessagePattern('reActive_Product_by_id')
  reActive({id}:{id:string}) {
    return this.productService.reActive(id);

  }

  @MessagePattern('upload_img')
  upload(
    {file,productId}:{file:string,productId:string}
  ) {
    return this.productService.upload(file,productId)
  }

  @MessagePattern("delete_product_img")
  deleteImage(
    {imageId}:{imageId:string}
  ) {
    return this.productService.deleteProductImage(imageId)

  }
}
