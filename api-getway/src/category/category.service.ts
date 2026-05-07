/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy
  ) {}
  
  create(createCategoryDto: CreateCategoryDto) {
    return this.productClient.send("create_category", createCategoryDto);
  }



  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.productClient.send("update_category", { id, ...updateCategoryDto });
  }

  remove(id: string) {
    return this.productClient.send("remove_category", { id });
  }

  reActiveCategory(id:string) {
    return this.productClient.send("reActive_category", { id });
  }
}
