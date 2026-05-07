/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from 'src/auth/gurads/jwt/jwt.guard';
import { AdminGuard } from 'src/auth/gurads/admin/admin.guard';

@Controller('category')
@UseGuards(JwtGuard,AdminGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }



  @Patch(':id')
  update(@Param('id' , new ParseUUIDPipe()) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoryService.remove(id);
  }
  @Patch('re-active/:id')
  reActive(
    @Param('id', new ParseUUIDPipe()) id: string
  ) {
    return this.categoryService.reActiveCategory(id)
  }


}
