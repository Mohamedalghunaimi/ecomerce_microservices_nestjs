/* eslint-disable prettier/prettier */
import { Controller,  } from '@nestjs/common';
import { CategoryService } from './category.service';
;
import { MessagePattern } from '@nestjs/microservices';
import type { CategoryData } from 'utils/interfaces';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('create_category')
  create(
    createCategoryDto: CategoryData
  ) {
    return this.categoryService.create(createCategoryDto);
  }



  @MessagePattern("update_category")
  update(
    {id,...updateCategoryDto}: {id:string} & Partial<CategoryData>
  ) {

    return this.categoryService.update(id,updateCategoryDto);
  }
  @MessagePattern("remove_category")
  remove(
    {id}: {id:string}
  ) {
    return this.categoryService.remove(id);
  }
  @MessagePattern("reActive_category")
  reActiveCategory(
    {id}:{id:string}
  ) {
    return this.categoryService.reActive(id)
  }


}
